require_relative 'bank_account'

class SalaryAccount < CheckingAccount
  def transfer(account, amount)
  	log_transaction("This account can't transfer funds", amount);
  end
  def initialize
  	super
  	@monthly_fee = 10
  end
end
