require_relative 'checking_account'

class StudentAccount < CheckingAccount
  CREDIT_LINE = 0
	def initialize
    super
    @monthly_fee = 0
  end
  def withdraw(amount)
    if @balance-amount < 0
      log_transaction("Couldn't withdraw: Not enough funds and credit line", amount);
    else
      @balance -= amount
      log_transaction('Withdrawal', amount)
    end
  end
end
