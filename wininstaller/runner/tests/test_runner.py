"""Uji logika runner tanpa VPS dan tanpa jaringan.

Menjalankan run_job() dengan Api dan koneksi SSH palsu, memastikan:
  1. preflight menolak OpenVZ
  2. preflight menolak RAM < 2 GB
  3. jalur normal membangun perintah yang benar dan menandai job selesai
  4. password tidak bocor ke event

    python -m unittest discover -s tests -v
"""
import asyncio
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import runner as R  # noqa: E402


class FakeApi:
    def __init__(self):
        self.events_log = []
        self.status = None
        self.error = ''

    def events(self, job_id, events, status=None, error=''):
        self.events_log.extend(events)
        if status:
            self.status = status
        if error:
            self.error = error
        return {'ok': True}

    def heartbeat(self):
        pass

    def text(self):
        return '\n'.join(e['msg'] for e in self.events_log)


class FakeResult:
    def __init__(self, stdout='', stderr='', exit_status=0):
        self.stdout = stdout
        self.stderr = stderr
        self.exit_status = exit_status


class FakeProcess:
    def __init__(self, lines):
        self.stdout = lines
        self.stderr = ''

    def close(self):
        pass


class FakeReader:
    def __init__(self, text):
        self.text = text
        self.sent = False

    async def read(self, n):
        if self.sent or not self.text:
            return ''
        self.sent = True
        return self.text


class FakeConn:
    def __init__(self, preflight_line, exec_lines='installing…\n'):
        self.preflight_line = preflight_line
        self.exec_lines = exec_lines
        self.commands = []

    async def run(self, cmd, check=False, timeout=None):
        self.commands.append(cmd)
        if 'WI|' in cmd:
            return FakeResult(stdout=self.preflight_line + '\n')
        return FakeResult(stdout='146276 /tmp/wi-reinstall.sh\n')

    async def create_process(self, cmd, term_type=None):
        self.commands.append(cmd)
        p = FakeProcess(FakeReader(self.exec_lines))
        p.stderr = FakeReader('')
        return p

    def close(self):
        pass


def job(**over):
    base = {
        'id': '11111111-2222-3333-4444-555555555555',
        'os': 'ws2022',
        'osName': 'Windows Server 2022',
        'mode': 'live',
        'host': '203.0.113.9',
        'port': 22,
        'sshUser': 'root',
        'hostname': 'winserver',
        'adminPass': 'Admin-Pass-999',
        'auth': 'pass',
        'secret': 'rahasia',
        'network': {'staticIp': '', 'gateway': '', 'dns1': '', 'dns2': ''},
    }
    base.update(over)
    return base


class RunnerTests(unittest.TestCase):
    def run_case(self, preflight_line, j=None, rdp_ok=True):
        api = FakeApi()
        conn = FakeConn(preflight_line)
        j = j or job()

        async def fake_connect(_job):
            return conn

        orig_connect, orig_wait = R.connect, R.wait_rdp
        R.connect = fake_connect

        async def fake_wait(host, minutes, rep, api=None):
            rep.step('rdp', 'port 3389 terbuka', 'ok')
            return rdp_ok

        R.wait_rdp = fake_wait
        try:
            asyncio.run(R.run_job(api, j, hold=False, rdp_wait=1, dry=False))
        finally:
            R.connect, R.wait_rdp = orig_connect, orig_wait
        return api, conn

    def test_openvz_ditolak(self):
        api, conn = self.run_case('WI|openvz|4096|50|bios|yes|yes|ubuntu')
        self.assertEqual(api.status, 'error')
        self.assertIn('tidak didukung', api.error)
        self.assertFalse(any('reinstall.sh windows' in c for c in conn.commands))

    def test_ram_kecil_ditolak(self):
        api, conn = self.run_case('WI|kvm|800|50|bios|yes|yes|ubuntu')
        self.assertEqual(api.status, 'error')
        self.assertIn('RAM', api.error)
        self.assertFalse(any('reinstall.sh windows' in c for c in conn.commands))

    def test_disk_kecil_ditolak(self):
        api, _ = self.run_case('WI|kvm|4096|12|bios|yes|yes|ubuntu')
        self.assertEqual(api.status, 'error')
        self.assertIn('disk', api.error.lower())

    def test_jalur_normal(self):
        api, conn = self.run_case('WI|kvm|7950|48|bios|yes|yes|ubuntu')
        self.assertEqual(api.status, 'done')
        run_cmd = [c for c in conn.commands if 'reinstall.sh windows' in c]
        self.assertEqual(len(run_cmd), 1, 'perintah reinstall harus dijalankan sekali')
        cmd = run_cmd[0]
        self.assertIn('Windows Server 2022 ServerStandard', cmd)
        self.assertIn('--lang en-us', cmd)
        self.assertIn('--rdp-port 3389', cmd)
        self.assertIn('--allow-ping', cmd)
        self.assertNotIn('--hold', cmd)

    def test_password_tidak_bocor_ke_log(self):
        api, _ = self.run_case('WI|kvm|7950|48|bios|yes|yes|ubuntu')
        self.assertNotIn('Admin-Pass-999', api.text())
        self.assertIn('***', api.text())

    def test_reboot_dikirim_setelah_instalasi(self):
        """Skrip hanya menyiapkan GRUB; reboot harus dikirim runner sendiri."""
        api, conn = self.run_case('WI|kvm|7950|48|bios|yes|yes|ubuntu')
        self.assertTrue(any('reboot' in c for c in conn.commands),
                        'runner wajib mengirim reboot setelah staging selesai')
        self.assertEqual(api.status, 'done')

    def test_mode_hold_tidak_reboot(self):
        api = FakeApi()
        conn = FakeConn('WI|kvm|7950|48|bios|yes|yes|ubuntu')

        async def fake_connect(_job):
            return conn

        orig = R.connect
        R.connect = fake_connect
        try:
            asyncio.run(R.run_job(api, job(), hold=True, rdp_wait=1, dry=False))
        finally:
            R.connect = orig
        self.assertFalse(any('reboot' in c for c in conn.commands))
        self.assertEqual(api.status, 'done')

    def test_lolos_syarat_dicatat(self):
        api, _ = self.run_case('WI|kvm|7950|48|uefi|yes|yes|debian')
        self.assertIn('lolos syarat', api.text())


if __name__ == '__main__':
    unittest.main(verbosity=2)
