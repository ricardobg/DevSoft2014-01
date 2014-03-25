def upcase entrada
   ret = ""
   hash_table =
   { 
     "a" => "A",
	 "b" => "B",
	 "c" => "C",
	 "d" => "D",
	 "e" => "E",
	 "f" => "F",
	 "g" => "G",
	 "h" => "H",
	 "i" => "I",
	 "j" => "J",
	 "k" => "K",
	 "l" => "L",
	 "m" => "M",
	 "n" => "N",
	 "o" => "O",
	 "p" => "P",
	 "q" => "Q",
	 "r" => "R",
	 "s" => "S",
	 "t" => "T",
	 "u" => "U",	 
	 "v" => "V",
	 "x" => "X",
	 "w" => "W",
	 "y" => "Y",
	 "z" => "Z"
	}
	entrada.each_char do |elemento|
	   if hash_table[elemento] != nil
	      ret += hash_table[elemento]
	   else
	      ret += elemento
	   end
	end
	return ret
end

frase = "introducao a ruby finalizada"
puts upcase(frase)