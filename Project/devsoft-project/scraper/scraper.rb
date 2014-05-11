# encoding:utf-8

require 'mechanize'
require 'json'

################################################
##           !USE YOUR CREDENTIALS            ##
################################################
USERNAME = 'XXXXXX' # Use your username!
PASSWORD = 'XXXXXX' # Use your password!
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

mechanize.get("http://estagios.pcs.usp.br/aluno/vagas/listarVagasCadastradas.aspx");

save_html('internship_list', mechanize.page.body);

job_list = []
doc = mechanize.page.parser
selector = '#ContentPlaceHolder1_grdVagas tr td[1]'
doc.css(selector).each do |line|
    job = Job.new(line)
    job_list << job
end

puts job_list.length.to_s + ' jobs found!'
puts 'Loading jobs...'
# Load each internship data
job_list.each do |job|
    mechanize.get("http://estagios.pcs.usp.br/aluno/vagas/exibirVaga.aspx?id=" + job.code)
    doc = mechanize.page.parser
    selector = 'div.formulario[1] table tr'
    # Load attributes
    doc.css(selector).each do |job_data|
        if job_data.at('td[1]') != nil
            job.data[job_data.at('td[1]').text.strip] = job_data.at('td[2]').text.strip
        end
    end
end

#
#  ALL DATA LOADED
#
puts 'Data loaded!'
puts 'Generating JSON...'
#
#  CREATE JSON
#
return_json = '{'
job_list.each do |job|
   return_json += '"' + job.code + '":'
   return_json += JSON.generate(job.data)
   return_json += ','
end
if (return_json != '}')
    return_json = return_json[0..-2]
end
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
