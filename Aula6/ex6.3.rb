# encoding: utf-8

# -----------------
# Introdução
# -----------------

# O objetivo deste exercício é avaliar como o desempenho de um determinado
# programa ou trecho de código varia de acordo com o número de threads
# utilizadas.

# Vamos avaliar o uso de threads em dois tipos de programa: o primeiro é do tipo
# "IO-intensive", isto é, um programa que gasta a maior parte do tempo em
# execuções de I/O (entrada e saída), como fazer o download de arquivos da
# Internet.

# O segundo programa é do tipo "CPU-intensive", isto é, um programa que gasta a
# maior parte do tempo fazendo cálculos (utilizando o processador).

# Para cada um destes programas, você deverá escrever três versões dele:
# 1) Uma versão sequencial (que não usa threads)
# 2) Uma versão que usa um número pequeno de threads
# 3) Uma versão que usa um número muito grande de threads

# A biblioteca de benchmark do Ruby
# (http://ruby-doc.org/stdlib-1.9.2/libdoc/benchmark/rdoc/Benchmark.html)
# será utilizada para comparar o desempenho destas diferentes versões.

# -----------------
# Exercício 6.4
# -----------------

# Importa a biblioteca de benchmark do Ruby
require 'benchmark'
require 'mechanize'

# Cada versão será executada N vezes, para garantir condições médias de
# desempenho.
N = 50_000

def links

  # Esta função baixa todos os links desta página:
  # http://en.wikipedia.org/wiki/List_of_programming_languages

  # Vamos utilizar uma biblioteca chamada Mechanize para fazer download
  # dos links.

  m = Mechanize.new

  # Baixa a página principal, que tem todos os links.
  m.get('http://en.wikipedia.org/wiki/List_of_programming_languages')
  links = m.page.links.
    map { |link| link.href }.
    select { |path| path =~ /\A\/wiki/ }.
    map { |path| "http://en.wikipedia.org#{path}" }
end

def io_v1
  # Versão sequencial do programa IO-intensive.
  # Escreva aqui uma função que itera sobre os links retornados pela
  # função links e usa o Mechanize para baixar cada link.
  # Utilize uma nova instância do Mechanize por iteração.
  down_links = links
  down_links.each do |link|
    mech = Mechanize.new
    mech.get(link)
  end

end

def io_v2
  # Versão do IO-intensive com 10 threads.
  threads = []
  down_links = links
  divided_links = []

  if down_links.length >= 10
     # tenta dividir em 10 grupos
    divided_links = down_links.each_slice(down_links.length/10).to_a
    # caso o numero de links nao seja multiplo de 10, elimina links a mais
    # e os coloca nos 10 primeiros
    if divided_links.length > 10
      pos = 0
      while divided_links.length > 10
        divided_links[pos] << divided_links[10][0]
        divided_links[10].delete_at(0)
        if divided_links[10].empty?
          divided_links.delete_at(10)
        end
        pos = (pos + 1) % 10
      end
    end
  else
    divided_links = down_links.each_slice(1).to_a
  end
  divided_links.each do |link_list|
    t = Thread.new {
      link_list.each do |link|
        mech = Mechanize.new
        mech.get(link)
      end
    }
    threads << t
  end

  threads.each { |t| t.join }
end

def io_v3
  # Versão do IO-intensive com 100 threads.
  threads = []
  down_links = links
  # dividir os links em 100 grupos
  divided_links = []

  if down_links.length >= 100
    # tenta dividir em 100 grupos
    divided_links = down_links.each_slice(down_links.length/100).to_a
    # caso o numero de links nao seja multiplo de 100, elimina links a mais
    # e os coloca nos 100 primeiros
    if divided_links.length > 100
      pos = 0
      while divided_links.length > 100
        divided_links[pos] << divided_links[100][0]
        divided_links[100].delete_at(0)
        if divided_links[100].empty?
          divided_links.delete_at(100)
        end
        pos = (pos + 1) % 100
      end
    end
  # menos de 100 links
  else
    divided_links = down_links.each_slice(1).to_a
  end

  divided_links.each do |link_list|
    t = Thread.new {
      link_list.each do |link|
        mech = Mechanize.new
        mech.get(link)
      end
    }

    threads << t
  end

  threads.each { |t| t.join }
end

def sum(n)
  500_000.downto(n).reduce(:+)
end

def cpu_v1
  # Versão sequencial do programa CPU-intensive.
  # Escreva uma função que chama a função sum(n) para todos os inteiros
  # entre 0 e 100.
  i = 0
  while i < 100
    sum(i)
    i += 1
  end
end

def cpu_v2
  # Versão do CPU-intensive com 10 threads.
  i = 1
  threads = []
  while i <= 10
    t = Thread.new {
      j = (i-1)*10
      while j < 10*i
        sum(j)
        j += 1
      end
    }
    threads << t
    i += 1
  end
  threads.each { |t| t.join }
end

def cpu_v3
  # Versão do CPU-intensive com 100 threads.
  i = 0
  threads = []
  while i < 100
    t = Thread.new {
      sum(i)
    }
    threads << t
    i += 1
  end
  threads.each { |t| t.join }
end

puts "Execução dos programas 'IO-intensive' (download de arquivos):"
puts "-------------------------------------------------------------\n\n"

Benchmark.bm do |reporter|
  reporter.report { io_v1 }
  reporter.report { io_v2 }
  reporter.report { io_v3 }
end
puts "\n\n"
puts "Execução dos programas 'CPU-intensive (cálculo de fatorial)':"
puts "-------------------------------------------------------------\n\n"

Benchmark.bm do |reporter|
  reporter.report { cpu_v1 }
  reporter.report { cpu_v2 }
  reporter.report { cpu_v3 }
end

#
# Escreva as suas conclusões sobre como o desempenho variou para cada versão
# (melhorou ou piorou?) e para cada tipo de programa.
#
# Aqui os resultados:

#Execução dos programas 'IO-intensive' (download de arquivos):
#-------------------------------------------------------------
#
#       user     system      total        real
#   3.640000   0.060000   3.700000 (  6.780568)
#   3.600000   0.220000   3.820000 (  4.262991)
#   3.830000   0.300000   4.130000 (  4.159513)

#Execução dos programas 'CPU-intensive (cálculo de fatorial)':
#-------------------------------------------------------------
#
#       user     system      total        real
#   11.780000   0.290000  12.070000 ( 12.081777)
#   44.260000   1.110000  45.370000 ( 45.515203)
#   45.170000   0.780000  45.950000 ( 45.990917)

# É possível concluir que no download de arquivos há uma melhora com
# o aumento de threads.

# Já no cálculo do fatorial, o ideal é termos poucas threads

