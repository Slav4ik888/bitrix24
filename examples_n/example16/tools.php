<?
define('APP_ID', 'local.5641a7ab66e934.69453058');
define('APP_SECRET_CODE', '7f0cca3c53379b801698a6fb15412812');
define('APP_REG_URL', 'https://b24go.com/rating/index.php');

require_once("db.php");
require_once('bitrix24.php');
require_once('bitrix24exception.php');
require_once('bitrix24entity.php');
require_once('bitrix24user.php');
require_once('bitrix24batch.php');

$settings = array(
    'host' => 'b24go.mysql',
    'user' => 'b24go_mysql',
    'pass' => '84ow3veo',
    'db' => 'b24go_db',
    'port' => 3306,
    'charset' => 'utf8',
);


//B24

function prepareFromRequest($arRequest) {
	$arResult = array();
	$arResult['domain'] = $arRequest['DOMAIN'];
	$arResult['member_id'] = $arRequest['member_id'];
	$arResult['refresh_token'] = $arRequest['REFRESH_ID'];
	$arResult['access_token'] = $arRequest['AUTH_ID'];
	
	return $arResult;
}

function getBitrix24 (&$arAccessData, &$btokenRefreshed, &$errorMessage, $arScope=array()) {
	$btokenRefreshed = null;

	$obB24App = new \Bitrix24\Bitrix24();
	if (!is_array($arScope)) {
		$arScope = array();
	}
	if (!in_array('user', $arScope)) {
		$arScope[] = 'user';
	}
	$obB24App->setApplicationScope($arScope);
	$obB24App->setApplicationId(APP_ID); //из настроек в MP
	$obB24App->setApplicationSecret(APP_SECRET_CODE); //из настроек в MP

	// set user-specific settings
	$obB24App->setDomain($arAccessData['domain']);
	$obB24App->setMemberId($arAccessData['member_id']);
	$obB24App->setRefreshToken($arAccessData['refresh_token']);
	$obB24App->setAccessToken($arAccessData['access_token']);
	
	try {
		$resExpire = $obB24App->isAccessTokenExpire();
	}
	catch(\Exception $e) {
		$errorMessage = $e->getMessage();
		// cnLog::Add('Access-expired exception error: '. $error);
	}

	if ($resExpire) {
		// cnLog::Add('Access - expired');
		
		$obB24App->setRedirectUri(APP_REG_URL);

		try {
			$result = $obB24App->getNewAccessToken();
		}
		catch(\Exception $e) {
			$errorMessage = $e->getMessage();
			//\cnLog::Add('getNewAccessToken exception error: '. $error);
		}
		if ($result === false) {
			$errorMessage = 'access denied';
		}
		elseif (is_array($result) && array_key_exists('access_token', $result) && !empty($result['access_token'])) {
			$arAccessData['refresh_token']=$result['refresh_token'];
			$arAccessData['access_token']=$result['access_token'];
			$obB24App->setRefreshToken($arAccessData['refresh_token']);
			$obB24App->setAccessToken($arAccessData['access_token']);
			// \cnLog::Add('Access - refreshed');
			$btokenRefreshed = true;
		}
		else {
			$btokenRefreshed = false;
		}
	}
	else {
		$btokenRefreshed = false;
	}

	return $obB24App;	
}



global $db;

$db = new SafeMySQL($settings);
