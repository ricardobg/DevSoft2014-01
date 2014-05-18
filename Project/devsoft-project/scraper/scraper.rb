# encoding:utf-8

require 'mechanize'
require 'json'

################################################
##           !USE YOUR CREDENTIALS            ##
################################################
USERNAME = 'aluno' # Use your username!
PASSWORD = '12345' # Use your password!
MAX_SEARCH = 2000  # Max number of searched jobs
N_THREADS = MAX_SEARCH/20
JSON_LOCATION = 'my_json.json'
#
# Helper function that saves a HTML file on the html directory.
#
# @param [String] filename the name of the file to be saved.
# @param [String] body the body of the HTML file.
#
def save_html(filename, body)
    File.open("saved_html/#{filename}.html", "w") do |f|
        f.write(body.force_encoding('utf-8'))
    end
end

#
# Class to hold data
#
class Job
    attr_accessor :code, :data
    def initialize(code)
        @code = code
        @data = Hash.new
    end
    
end

#
#  LOAD DATA
#
puts 'Logging in...'
mechanize = Mechanize.new
mechanize.user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36"

mechanize.get('http://estagios.pcs.usp.br/')
mechanize.get('http://estagios.pcs.usp.br/semLogin/login.aspx')

save_html('before_login', mechanize.page.body)

form = mechanize.page.forms[0]

headers = {
    'Host' => 'estagios.pcs.usp.br',
    'Connection'      => 'keep-alive',
    'Cache-Control'   => 'max-age=0',
    'Accept'          => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Origin'          => 'http://estagios.pcs.usp.br',
    'Content-Type'    => 'application/x-www-form-urlencoded',
    'Referer'         => 'http://estagios.pcs.usp.br/semLogin/login.aspx',
    'Accept-Encoding' => 'gzip,deflate,sdch',
    'Accept-Language' => 'en-US,en;q=0.8,pt;q=0.6,de;q=0.4'
}

params = {
    '__EVENTTARGET'     => '',
    '__EVENTARGUMENT'   => '',
    '__VIEWSTATE'       => form.field_with(name: '__VIEWSTATE').value,
    '__EVENTVALIDATION' => form.field_with(name: '__EVENTVALIDATION').value,
    'ctl00$ContentPlaceHolder1$Login1$UserName'    => USERNAME,
    'ctl00$ContentPlaceHolder1$Login1$Password'    => PASSWORD,
    'ctl00$ContentPlaceHolder1$Login1$LoginButton' => 'Logar'
}

mechanize.post("http://estagios.pcs.usp.br/semLogin/login.aspx", params, headers)

save_html('after_login', mechanize.page.body)

puts 'Logged!'
puts 'Searching for jobs...'

## Navigate to list of internship


job_list = []

for i in 0..(MAX_SEARCH-1)
    job = Job.new(i.to_s)
    job_list << job
end

puts 'Looking for ' + job_list.length.to_s + ' jobs'
puts 'Loading jobs...'
# Load each internship data

porcentagem = 0.00;
job_list.each do |job|
    print "\r" + porcentagem.to_s + "%";
    mechanize.get("http://estagios.pcs.usp.br/aluno/vagas/exibirVaga.aspx?id=" + job.code)
    doc = mechanize.page.parser
    selector = 'div.formulario[1] table tr'
    # Load attributes
    doc.css(selector).each do |job_data|
        if job_data.at('td[1]') != nil
            job.data[job_data.at('td[1]').text.strip] = job_data.at('td[2]').text.strip
        end
    end
    porcentagem += 100.0/MAX_SEARCH;
end
puts "\n100%"

#
#  ALL DATA LOADED
#
puts 'Data loaded!'
puts 'Generating JSON...'
#
#  CREATE JSON
#
return_json = '{'
return_json += '"data_coleta": "' + Time.now.strftime("%d/%m/%Y") + '",';
return_json += '"paginas_acessadas": "' + MAX_SEARCH.to_s + '",';
job_list.each do |job|
   return_json += '"' + job.code + '":'
   return_json += JSON.generate(job.data)
   return_json += ','
end
return_json = return_json[0..-2]
return_json += '}'

#
# JSON CREATED
#

puts 'JSON created!'
puts 'Writing file ' + JSON_LOCATION

File.open(JSON_LOCATION,"w") do |f|
    f.write(return_json)
end

puts 'File written!'
