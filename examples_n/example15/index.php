<?
	function redirect($url)
	{
		Header("HTTP 302 Found");
		Header("Location: ".$url);
		die();
	}	

	require_once('tools.php');

	$domain = isset($_REQUEST['portal']) ? $_REQUEST['portal'] : ( isset($_REQUEST['domain']) ? $_REQUEST['domain'] : 'empty');

	$step = 0;

	if (isset($_REQUEST['portal'])) $step = 1;
	if (isset($_REQUEST['code']))$step = 2;
	
	$btokenRefreshed = null;

	$obB24App = new \Bitrix24\Bitrix24();
	$arScope = array('user');
	
	$obB24App->setApplicationScope($arScope);
	$obB24App->setApplicationId(APP_ID); //из настроек в MP
	$obB24App->setApplicationSecret(APP_SECRET_CODE); //из настроек в MP
	$obB24App->setRedirectUri(APP_REG_URL);
	$obB24App->setDomain($domain);

	switch ($step) {
		case 1:
			$obB24App->requestCode();
			break;
		case 2:
			
			$obB24App->setApplicationCode($_REQUEST['code']);
			$arAccessParams = $obB24App->requestAccessToken();
			
			$obB24App->setMemberId($arAccessParams['member_id']);
			$obB24App->setRefreshToken($arAccessParams['refresh_token']);
			$obB24App->setAccessToken($arAccessParams['access_token']);
			
			$obB24User = new \Bitrix24\Bitrix24User\Bitrix24User($obB24App);
			$arCurrentB24User = $obB24User->current();
			break;
		default:
			break;
	}	
?>
<!doctype html>
<html lang="ru">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Рейтинг (пример 15)</title>

    <!-- Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet">

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="//oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="//oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
	
	<!-- Include roboto.css to use the Roboto web font, material.css to include the theme and ripples.css to style the ripple effect -->
	<link href="css/roboto.min.css" rel="stylesheet">
	<link href="css/material.min.css" rel="stylesheet">
	<link href="css/ripples.min.css" rel="stylesheet">
	
    <link href="css/application.css" rel="stylesheet">

</head>
<body>
<div id="app" class="container-fluid">

	<div class="bs-callout bs-callout-danger">
		<h4>3-й тип приложений</h4>
		<p>OAuth 2.0 аутентификация Битрикс24</p>
	</div>
	<div class="alert alert-dismissable alert-warning hidden" id="error"></div>
	<div class="row">
		<div class="col-md-12 col-sm-12">
			<?if ($step == 0) {?>
			<form action="" method="post">
				<input type="text" name="portal" placeholder="Адрес портала">
				<input type="submit" value="Авторизоваться">
			</form>
			<?
			}
			elseif ($step == 2) {
				echo $arCurrentB24User["result"]["NAME"]." ".$arCurrentB24User["result"]["LAST_NAME"]."<br/><pre>";
				print_r($arAccessParams);
				echo "</pre>";
			}
			?>
		</div>
	</div>
</div>

<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script type="text/javascript" src="js/bootstrap.min.js"></script>
<script src="js/ripples.min.js"></script>
<script src="js/material.min.js"></script>
<script src="//api.bitrix24.com/api/v1/"></script>

<script>
	
    $(document).ready(function () {

		BX24.init(function(){
		
			$.material.init();

		});
    });

</script>

</body>
</html>