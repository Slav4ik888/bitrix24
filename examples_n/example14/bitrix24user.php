<?php
namespace Bitrix24\Bitrix24User;
use Bitrix24\Bitrix24Entity;
use Bitrix24\Bitrix24Exception;

class Bitrix24User extends Bitrix24Entity
{
	/**
	 * Check is current user admin
	 * @link http://dev.1c-bitrix.ru/rest_help/general/user_admin.php
	 * @throws Bitrix24Exception
	 * @return boolean
	 */
	public function admin()
	{
		$result = $this->client->call('user.admin');
		return $result['result'];
	}

	/**
	 * Get information about current user by his auth information. This method will be use security sign automatically
	 * @link http://dev.1c-bitrix.ru/rest_help/users/user_current.php
	 * @throws Bitrix24Exception
	 * @return array
	 */
	public function current()
	{
		$result = $this->client->call('user.current', array('state' => $this->client->getSecuritySignSalt()));
		return $result;
	}

	/**
	 * Get list of fields entity user
	 * @link http://dev.1c-bitrix.ru/rest_help/users/user_fields.php
	 * @throws Bitrix24Exception
	 * @return array
	 */
	public function fields()
	{
		$result = $this->client->call('user.fields');
		return $result;
	}

	/**
	 * Get list of users
	 * @link http://dev.1c-bitrix.ru/rest_help/users/user_get.php
	 * @throws Bitrix24Exception
	 * @param $SORT - field name to sort by them
	 * @param $ORDER - sort direction? must be set to ASC or DESC
	 * @param $FILTER - list of fields user entity to filter result
	 * @return array
	 */
	public function get($SORT, $ORDER, $FILTER)
	{
		$result = $this->client->call('user.get',
			array(
				'SORT' => $SORT,
				'ORDER' => $ORDER,
				'FILTER'=> $FILTER)
		);
		return $result;
	}
}