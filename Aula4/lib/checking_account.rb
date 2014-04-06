require_relative 'bank_account'

class CheckingAccount < BankAccount

  def deposit(amount)
    @balance += amount
    log_transaction('Deposit', amount)
  end

  def withdraw(amount)
    if @balance-amount < -CREDIT_LINE
      log_transaction("Couldn't withdraw: Not enough funds and credit line", amount);
    else
      @balance -= amount
      log_transaction('Withdrawal', amount)
    end
  end

  def transfer(account, amount)
    fare = 8
    if @balance < fare+amount
      log_transaction("Couldn't transfer: Not enough funds", amount)
    else
      withdraw(amount+fare)
      account.deposit(amount)
    end

  end

end
