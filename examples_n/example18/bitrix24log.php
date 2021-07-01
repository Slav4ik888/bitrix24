<?php
namespace Bitrix24\Bitrix24Log;
use Bitrix24\Bitrix24Entity;
use Bitrix24\Bitrix24Exception;

class Bitrix24Log extends Bitrix24Entity
{

	/**
	 * Put a message to blog
	 * @link http://dev.1c-bitrix.ru/community/blogs/wladart/rest_logblogpostadd.php
	 * @throws Bitrix24Exception
	 * @param $POST_MESSAGE - text of message
	 * @param $POST_TITLE - title of message
	 * @param $SPERM - permission to ready
	 * @return array
	 */
	public function add($POST_MESSAGE, $POST_TITLE, $SPERM, $FILES)
	{
		$result = $this->client->call('log.blogpost.add',
			array(
				'POST_MESSAGE' => $POST_MESSAGE,
				'POST_TITLE' => $POST_TITLE,
				'SPERM' => $SPERM,
				'FILES' => $FILES)
		);
		return $result;
	}
}