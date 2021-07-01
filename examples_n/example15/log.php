<?
namespace CB24Log;

define('LOG_DIR', $_SERVER['DOCUMENT_ROOT'].'/rating/'.'logs');
define('DEBUG', true);

/**
* CB24Log
*/

/**
* ����������� ���������� ����������
*
* ������ �������������:
* \cnLog::Add('string message'.print_r($someVar, true));
* ��� ������� ����:
* \cnLog::Add('some required text', true);
* @static
*/

class CB24Log {

	private $active=false;

	private function __construct() {}
	/**
	 * ������ � ���
	 * @param string  $msg   �����, ������� ����� ������� � ���
	 * @param boolean $clean ���� ����������� - ������� ���-����
	 */
	public static function Add($msg, $clean=false) {
		if (defined('LOG_DIR') && is_string($msg)) {
			$DATE = date('Y-m-d H:i:s');
			$strLogFile = date('Y-m-d').".log";
			$strCalledFrom = '';
			if (function_exists('debug_backtrace')) {
				$locations = debug_backtrace();
				$strCalledFrom = 'F: '.$locations[0]['file']. "\n" . '      L: '.$locations[0]['line'];
			}
			$logMsg = "\n" .
					'date: ' . $DATE . "\n" .
					'mess: ' . $msg . "\n" .
					'from: ' . $strCalledFrom . "\n" .
					'uri : ' . $_SERVER['REQUEST_URI'] . "\n" .
					'----------------------------------------------------------';
			if ($clean) {
				self::CleanLog($strLogFile);
			}
			self::AppendLog($logMsg, $strLogFile);
		}
	}

	/**
	 * ������� ���������� ����� ������ � ���
	 * @param string $msg ����� ������
	 */
	private static function AppendLog($msg, $filename) {
		$log_file = LOG_DIR.'/'.$filename;
		$mode = 'ab';
		
		if (!file_exists($log_file)) $mode = 'x';
			
		if ($fp = fopen(LOG_DIR.'/'.$filename, $mode)) {
			fwrite($fp, $msg);
			fclose($fp);
		}
	}

	/**
	 * �������� ���-�����
	 */
	private static function CleanLog($filename) {
		@unlink(LOG_DIR.'/'.$filename);
	}

	/**
	 * ��������� ���-�����
	 */
	public static function GetLog($filename) {
		$log = false;
		if ($fp = fopen(LOG_DIR.'/'.$filename, 'rb')) {
			$log = fread($fp);
			fclose($fp);
		}
		return $log;
	}

}