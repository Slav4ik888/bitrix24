<?
require_once("tools.php");

class CRatingOperations
{
	public $arB24App;
	public $arAccessParams = array();
	
	public function returnResult ($answer) {
	
		ob_start();
		ob_end_clean();
		Header('Cache-Control: no-cache');
		Header('Pragma: no-cache');
		echo json_encode($answer);
	}
	
	private function checkB24Auth($params) {
		// проверяем актуальность доступа
		$this->arAccessParams = $params;
		$isTokenRefreshed = false;
		$errorB24 = '';
		
		// $arAccessParams['access_token'] = '123';
		// $arAccessParams['refresh_token'] = '333';
		
		$this->arB24App = getBitrix24($this->arAccessParams, $isTokenRefreshed, $errorB24);
		return $errorB24;
	}
	
    public function manage($operation, $params)
    {
		global $db;
		switch ($operation){
			case 'add_rating_users': 
			
				$errorB24 = $this->checkB24Auth($params);
				
				if ($errorB24 == '') {

					foreach ($params['users'] as $arUser) {
						$res = $db->insert('insert into b24_users (`PORTAL`, `ID_USER`, `NAME`) values (?, ?, ?)', 
							$params['domain'], $arUser['id'], $arUser['name']);
						if (!$res) break;	
					}
					
					if (!$res) $this->returnResult(array('status' => 'error', 'result' => $db->error()));
					else $this->returnResult(array('status' => 'success', 'result' => ''));
					
				}
				else $this->returnResult(array('status' => 'error', 'result' => $errorB24));
				
			break;
			case 'get_users': 
			
				$errorB24 = $this->checkB24Auth($params);
				
				if ($errorB24 == '') {					
					$yesterday = new DateTime();
					$yesterday->add(DateInterval::createFromDateString('yesterday'));
					$yesterday = $yesterday->format('Y-m-d');


                    $res = $db->select('SELECT users.*, rating.ID as ID_RATING_ITEM, rating.RATE_SUM, rating.RATE_DATE '.
						'FROM `b24_users` as users '.
						'LEFT JOIN `b24_ratings` as rating ON (rating.ID_USER = users.ID AND (rating.RATE_DATE = ? OR rating.RATE_DATE IS NULL) )'.
						'WHERE users.`PORTAL` = ?',  $yesterday, $params['domain']);

/*					$res = $db->select('SELECT users.*, rating.ID as ID_RATING_ITEM, rating.RATE_SUM,  rating.RATE_DATE '.
						'FROM `b24_users` as users '.
						'LEFT JOIN `b24_ratings` as rating ON rating.ID_USER = users.ID '.
						'WHERE users.`PORTAL` = ? AND '.
						'(rating.RATE_DATE = ? OR rating.RATE_DATE IS NULL) ', $params['domain'], $yesterday);*/
					
					if (count($res) == 0) $this->returnResult(array('status' => 'error', 'result' => 'no users'));
					else $this->returnResult(array('status' => 'success', 'result' => $res));
				}
				else $this->returnResult(array('status' => 'error', 'result' => $errorB24));
				
			break;
			
			case 'update_rating': 
			
				$errorB24 = $this->checkB24Auth($params);
				
				if ($errorB24 == '') {
					
					$res = $db->update('UPDATE `b24_ratings` SET RATE_SUM = ? '.
						'WHERE ID = ? ', $params['sum'], $params['id']);
					$error = $db->error();
						
					if ($error != '') $this->returnResult(array('status' => 'error', 'result' => $error));
					else $this->returnResult(array('status' => 'success', 'result' => ''));
				}
				else $this->returnResult(array('status' => 'error', 'result' => $errorB24));
				
			break;

			case 'add_rating': 
			
				$errorB24 = $this->checkB24Auth($params);
				
				if ($errorB24 == '') {
					
					$res = $db->select('SELECT ID FROM `b24_users` '.
						'WHERE `PORTAL` = ? AND ID_USER = ? ', $params['domain'], $params['id_user']);
					$portal_user_id = $res[0]['ID'];

					$res = $db->insert('INSERT INTO `b24_ratings` (ID_USER, RATE_DATE, RATE_SUM) VALUES (?, ?, ?)',
						$portal_user_id, $params['rate_date'], $params['sum']);
					$error = $db->error();
						
					if ($error != '') $this->returnResult(array('status' => 'error', 'result' => $error));
					else $this->returnResult(array('status' => 'success', 'result' => ''));
				}
				else $this->returnResult(array('status' => 'error', 'result' => $errorB24));
				
			break;
			
			default:
				$this->returnResult(array('status' => 'error', 'result' => 'unknown operation'));
		}		
    }
}

$manager = new CRatingOperations();

if (!empty($_REQUEST) && isset($_REQUEST['operation'])) {
	$manager->manage($_REQUEST['operation'], $_REQUEST);
}

?>