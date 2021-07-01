<?php
namespace Bitrix24\Bitrix24Batch;
use Bitrix24\Bitrix24Entity;
use Bitrix24\Bitrix24Exception;

class Bitrix24Batch extends \Bitrix24\Bitrix24Entity
{

	protected $callList = array();
	
	public function addCall($id, $command, array $params = array())
	{
		// !! "start" MUST. BE. FIRST in params array !! in other case cloud ignores it and batch is cycling forever
		
		if (!isset($params['start']))
			$params = array_merge(array("start"=>null), $params);
		else 
		{
			$start = $params["start"];
			unset($params["start"]);			
			$params = array_merge(array("start"=>$start), $params);
		}
		
		$this->callList[$id] = array("id" => $id, "cmd" => $command, "params" => $params, "state" => '');
	}
	
	public function addCompanyListCall($id, array $orders = array(), array $select = array(), array $filter = array(), $start = null)
	{
		$this->addCall($id, "crm.company.list", array("start" => $start, "orders" => $orders, "select" => $select, "filter" => $filter));
	}		
	
	public function addContactListCall($id, array $orders = array(), array $select = array(), array $filter = array(), $start = null)
	{
		$this->addCall($id, "crm.contact.list", array("start" => $start, "orders" => $orders, "select" => $select, "filter" => $filter));
	}		
	
	public function addUserListCall($id, array $filter = array(), $start = null)
	{
		$this->addCall($id, "user.get", array("start" => $start, "filter" => $filter));
	}		

	public function addDealListCall($id, array $orders = array(), array $select = array(), array $filter = array(), $start = null)
	{
		$this->addCall($id, "crm.deal.list", array("start" => $start, "orders" => $orders, "select" => $select, "filter" => $filter));
	}		
		
	public function clear()
	{
		$this->callList = array();
	}

	public function call()
	{
		//\cnLog::Add("+++++++++++++++    call ".count($this->callList));
	
		if (count($this->callList) == 0)
			return false;
			
		$commands = array();
		
		foreach ($this->callList as $cmd)
		{
			if (!isset($cmd['state']))
				$commands[] = $cmd;
			else 
				if ($cmd['state'] != 'fin' && $cmd['state'] != 'err')
					$commands[] = $cmd;  	
		}
			
		while (count($commands)>0)
		{
			//\cnLog::Add("+++++++++++++++    commands - ".count($commands));			
				
			if (count($commands) > 0)
			{
				try
				{
					$data = $this->client->callBatch($commands);
				}
				catch (Exception $e)
				{
					
				} 
			}
			else 
				return false;
			
			// store getted data to call list
			foreach($data['result']['result'] as $id => $rows)
			{
				if (!isset($this->callList[$id]['data']))
					$this->callList[$id]['data'] = array();
				$this->callList[$id]['data'] = array_merge($this->callList[$id]['data'], $rows);
			}		
		
			// store status to call list items
		
			// errors
			foreach($data['result']['result_error'] as $id => $err)
			{
				$this->callList[$id]['state'] = 'err';
				$this->callList[$id]['state_info'] = $err; 
			}
			
			// finished
			foreach($this->callList as $id => &$call)
			{
				if (isset($call['state']))
				{
					$this->callList[$id]['state'] = 'fin';
					$this->callList[$id]['state_info'] = ''; 
				} 
				elseif ($call['state'] != 'err' && $call['state'] != 'fin')
				{
					$this->callList[$id]['state'] = 'fin';
					$this->callList[$id]['state_info'] = ''; 
				} 
			}		
		
			//\cnLog::Add("+++++++++++++++    call list next list ". var_export($data['result']['result_next'], true));
					
		
			// unfinished
			foreach($data['result']['result_next'] as $id => $next)
			{
				$this->callList[$id]['state'] = 'queue';
				$this->callList[$id]['state_info'] = $data['result']['result_total'][$id] - $next;
				$this->callList[$id]['params']['start'] = $next;
				//\cnLog::Add("+++++++++++++++    call queue request ". $id . " " . $next);
			}		
			
			//\cnLog::Add("+++++++++++++++    call list refresh ". var_export($this->callList, true));			
			
			$commands = array();
			
			foreach ($this->callList as $cmd)
			{
				//\cnLog::Add("+++++++++++++++    call list refresh ". $cmd['id']." ".$cmd['state']);				
				
				if (!isset($cmd['state']))
					$commands[] = $cmd;
				else 
					if ($cmd['state'] != 'fin' && $cmd['state'] != 'err')
						$commands[] = $cmd;  	
			}
			
			$data = null;
						
		}	

		return $this->callList;		
	}
}