def fatorial n
  if n==0
     return 1
  end
  return fatorial(n-1)*n
end
puts "Fatorial de 20=#{fatorial(20)}"
