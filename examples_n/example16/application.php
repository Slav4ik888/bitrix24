<?
require_once("tools.php");
require_once("db.php");
require_once("log.php");

class CApplication
{
	public $arB24App;
	public $arAccessParams = array();
	public $arRatingUsers = array();
	public $currentUser = 0;
	private $b24_error = '';
	public $is_ajax_mode = false;
	public $currentRating = 0;

	private function checkB24Auth() {
	
		$isTokenRefreshed = false;
		
		// $arAccessParams['access_token'] = '123';
		// $arAccessParams['refresh_token'] = '333';
		
		$this->arB24App = getBitrix24($this->arAccessParams, $isTokenRefreshed, $this->b24_error);
		return $this->b24_error === true;
	}	

	private function returnJSONResult ($answer) {

	    ob_start();
		ob_end_clean();
		Header('Cache-Control: no-cache');
		Header('Pragma: no-cache');
		echo json_encode($answer);
		die();
	}
	
	private function getUsers (){
		$yesterday = new DateTime();
		$yesterday->add(DateInterval::createFromDateString('yesterday'));
		$yesterday = $yesterday->format('Y-m-d');

		global $db;
		
		$res = $db->getAll('SELECT users.*, rating.ID as ID_RATING_ITEM, rating.RATE_SUM, rating.RATE_DATE '.
						'FROM `b24_users` as users '.
						'LEFT JOIN `b24_ratings` as rating ON (rating.ID_USER = users.ID AND (rating.RATE_DATE = ?s OR rating.RATE_DATE IS NULL) )'.
						'WHERE users.`PORTAL` = ?s', $yesterday, $this->arAccessParams['domain']);
			
		return $res;
		
	}
	
	public function saveAuth() {
		global $db;
		
		$res = $db->query(
			'INSERT INTO b24_portal_reg (`PORTAL`, `ACCESS_TOKEN`, `REFRESH_TOKEN`, `MEMBER_ID`) values (?s, ?s, ?s, ?s)'.
			' ON DUPLICATE KEY UPDATE `ACCESS_TOKEN` = ?s, `REFRESH_TOKEN` = ?s, `MEMBER_ID` = ?s',
			$this->arB24App->getDomain(), $this->arB24App->getAccessToken(), $this->arB24App->getRefreshToken(), $this->arB24App->getMemberId(),
			$this->arB24App->getAccessToken(), $this->arB24App->getRefreshToken(), $this->arB24App->getMemberId()
		);
		
	}	
	
    public function manageAjax($operation, $params)
    {
		global $db;
		switch ($operation){
			case 'add_rating_users': 
			
				foreach ($params['users'] as $arUser) {
					try {

						$res = $db->query('insert into b24_users (`PORTAL`, `ID_USER`, `NAME`) values (?s, ?i, ?s)', 
							$params['domain'], $arUser['id'], $arUser['name']);
					}	
					catch (Exception $error) {
						$this->returnJSONResult(array('status' => 'error', 'result' => $error->getMessage()));
					}		
				}

                $this->saveAuth();
                $this->returnJSONResult(array('status' => 'success', 'result' => ''));

			break;
			
			case 'get_users': 
			
				$res = $this->getUsers();
									
				if (count($res) == 0) $this->returnJSONResult(array('status' => 'error', 'result' => 'no users'));
				else $this->returnJSONResult(array('status' => 'success', 'result' => $res));
				
			break;
			
			case 'update_rating': 
			
				try {

					$res = $db->query('UPDATE `b24_ratings` SET RATE_SUM = ?s '.
					'WHERE ID = ?i ', $params['sum'], $params['id']);
					$this->returnJSONResult(array('status' => 'success', 'result' => ''));				
				}	
				catch (Exception $error) {
					$this->returnJSONResult(array('status' => 'error', 'result' => $error->getMessage()));
				}		
				
			break;

			case 'add_rating': 
			
				$res = $db->getRow('SELECT ID FROM `b24_users` '.
					'WHERE `PORTAL` = ?s AND ID_USER = ?i ', $params['domain'], $params['id_user']);
			
				$portal_user_id = $res['ID'];

				try {

					$res = $db->query('INSERT INTO `b24_ratings` (ID_USER, RATE_DATE, RATE_SUM) VALUES (?i, ?s, ?s)',
					$portal_user_id, $params['rate_date'], $params['sum']);
					$this->returnJSONResult(array('status' => 'success', 'result' => ''));				
				}	
				catch (Exception $error) {
					$this->returnJSONResult(array('status' => 'error', 'result' => $error->getMessage()));
				}		
								
			break;
			
			default:
				$this->returnJSONResult(array('status' => 'error', 'result' => 'unknown operation'));
		}		
    }
	
	public function getData () {

		$obB24User = new \Bitrix24\Bitrix24User\Bitrix24User($this->arB24App);
		$arCurrentB24User = $obB24User->current();
		$this->currentUser = $arCurrentB24User["result"]["ID"];
				
		$users = $this->getUsers();
		
		$arDealFilter = array(
			"ASSIGNED_BY_ID" => $this->currentUser, 
			"CLOSED" => 'Y'/*,
			">=DATE_MODIFY": yesterday,
			"<DATE_MODIFY": today */
		);
		
		$obB24Batch = new \Bitrix24\Bitrix24Batch\Bitrix24Batch($this->arB24App);
		$obB24Batch->addDealListCall(0, 
			array("DATE_CREATE" => "ASC"),
			array("ID", "TITLE", "OPPORTUNITY", "ASSIGNED_BY_ID"), 
			$arDealFilter
		);

		$arUserIDs = array();
		foreach ($users as $arUser)
			$arUserIDs[] = $arUser["ID_USER"];
			
		$obB24Batch->addUserListCall(1, 
			array("ID" => $arUserIDs)
		);
		
		$res = $obB24Batch->call();
		
		foreach ($users as $key => $arUser)
			$this->arRatingUsers[$arUser["ID_USER"]] = $arUser;
			
		$this->currentRating = intval($this->arRatingUsers[$this->currentUser]["ID_RATING_ITEM"]);
		
		foreach ($res[1]["data"] as $arUser)
			$this->arRatingUsers[$arUser["ID"]] = array_merge(
				$this->arRatingUsers[$arUser["ID"]], 
				array(
					"FIRST_NAME" => $arUser["NAME"], 
					"LAST_NAME" => $arUser["LAST_NAME"], 
					"SECOND_NAME" => $arUser["SECOND_NAME"], 
					"PERSONAL_PHOTO" => $arUser["PERSONAL_PHOTO"])
			);

		$new_deal_sum = 0;
		
		foreach ($res[0]["data"] as $arDeal)
			$new_deal_sum += $arDeal["OPPORTUNITY"];
			
		$this->arRatingUsers[$this->currentUser]["RATE_SUM"] = $new_deal_sum;
		
	}
	
	public function start () {

		$this->is_ajax_mode = isset($_REQUEST['operation']);
		
		if (!$this->is_ajax_mode)
            $this->arAccessParams = prepareFromRequest($_REQUEST);
		else
			$this->arAccessParams = $_REQUEST;

		$this->b24_error = $this->checkB24Auth();
		
		if ($this->b24_error != '') {
			if ($this->is_ajax_mode)
				$this->returnJSONResult(array('status' => 'error', 'result' => $this->b24_error));
			else
				echo "B24 error: ".$this->b24_error;
			
			die;
		}
	}
}	

$application = new CApplication();

if (!empty($_REQUEST)) {
	$application->start();
	
	if ($application->is_ajax_mode) $application->manageAjax($_REQUEST['operation'], $_REQUEST);
	else $application->getData();
}
?>