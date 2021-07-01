<?
define('APP_ID', 'local.55ff17c583f981.97234676');
define('APP_SECRET_CODE', '23e41ac373cac716d51024437922e0e7');
define('APP_REG_URL', 'https://b24go.com/rating/index.php');

define ('IMAGE_DIR', $_SERVER['DOCUMENT_ROOT'].'/rating/images/');


require_once("db.php");
require_once('bitrix24.php');
require_once('bitrix24exception.php');
require_once('bitrix24entity.php');
require_once('bitrix24user.php');
require_once('bitrix24log.php');
require_once('bitrix24batch.php');

$settings = array(
    'host' => 'b24go.mysql',
    'user' => 'b24go_mysql',
    'pass' => '84ow3veo',
    'db' => 'b24go_db',
    'port' => 3306,
    'charset' => 'utf8',
);

// Images

function getExtension($filename) {
	return substr($filename, strrpos($filename, '.') + 1);
}

function putPhoto ($destination, $photo, $rating) {

	list($oldWidth, $oldHeight) = getimagesize($photo);

	$k = $oldWidth / 70;
	$y_offset = 90 - ($oldHeight / $k);
	 
	$extension = getExtension($photo);
	
	switch ($extension) {
		case 'jpeg':
		case 'jpg':
			$photo = imagecreatefromjpeg($photo);
			break;
		case 'png':
			$photo = imagecreatefrompng($photo);
			break;
		case 'gif':
			$photo = imagecreatefromgif($photo);
			break;
		default:
			echo "unsupported image type";
			die;
			break;
	}
	
	$positions = array(
		1 => array("LEFT" => 230, "TOP" => 110 - ($oldHeight / $k)),
		2 => array("LEFT" => 65, "TOP" => 186 - ($oldHeight / $k)),
		3 => array("LEFT" => 354, "TOP" => 224 - ($oldHeight / $k)),
		
	);
	
	imagecopyresampled($destination, $photo, 
		$positions[$rating]["LEFT"], $positions[$rating]["TOP"], 0, 0, 70, $oldHeight / $k, $oldWidth, $oldHeight);	
}

//B24

function prepareFromRequest($arRequest) {
	$arResult = array();
	$arResult['domain'] = $arRequest['DOMAIN'];
	$arResult['member_id'] = $arRequest['member_id'];
	$arResult['refresh_token'] = $arRequest['REFRESH_ID'];
	$arResult['access_token'] = $arRequest['AUTH_ID'];
	
	return $arResult;
}

function prepareFromDB($arAccessParams) {
	$arResult = array();
	$arResult['domain'] = $arAccessParams['PORTAL'];
	$arResult['member_id'] = $arAccessParams['MEMBER_ID'];
	$arResult['refresh_token'] = $arAccessParams['REFRESH_TOKEN'];
	$arResult['access_token'] = $arAccessParams['ACCESS_TOKEN'];
	
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
