<?
require_once("tools.php");

$arAccessData = prepareFromRequest($_REQUEST);

$btokenRefreshed = false;
$errorMessage = '';

global $B24App;

$B24App = getBitrix24($arAccessData, $btokenRefreshed, $errorMessage);

$obB24User = new \Bitrix24\Bitrix24User\Bitrix24User($B24App);
$arCurrentB24User = $obB24User->current();
?>