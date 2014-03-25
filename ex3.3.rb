def ordena lista
   if lista.size == 0 || lista.size == 1
      return lista
   end
   retorno = []
   # Esvazia a lista de entrada
   while lista.size > 0
      # Guarda o menor
      menor = nil
	  # Descobre o menor
      lista.each do |item|
         if menor == nil || item < menor
		    menor = item
		 end
      end
	  retorno.push(menor)
	  lista.delete_at(lista.index(menor))
   end
   return retorno
end

lista =  [20, 0, 50, 30, 34, 33, 35, 22, 1]
puts ordena(lista)
