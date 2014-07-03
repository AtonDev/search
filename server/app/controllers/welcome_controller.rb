class WelcomeController < ApplicationController
  require 'open-uri'

  def index
  end
 
  def s
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    headers['Access-Control-Allow-Headers'] = '*'
    @query = params["search"].split(' ')
    url = "http://www.google.com/search?q="
    @query.each do |term|
      url += term + '+' 
    end
    url = url[0..-2]
    page = open url 
    html = Nokogiri::HTML page
    i = 0
    @urls = Array.new
    html.search("cite").each do |cite|
      url = cite.inner_text
      if url[0..7] != "https://"
       url = "http://" + url
      end
      if url.include? "..."
      else
        @urls[i] = url
        i+=1
      end
   end
    render :json => { urls: @urls }
  end




  def search
    @query = params["search"].split(' ')
    url = "http://www.google.com/search?q="
    @query.each do |term|
      url += term + '+' 
    end
    url = url[0..-2]
    page = open url 
    html = Nokogiri::HTML page
    i = 0
    @files = Array.new
    @urls = Array.new
    html.search("cite").each do |cite|
      url = cite.inner_text
      if url[0..7] != "https://"
       url = "http://" + url
      end
      if url.include? "..."
      else
        begin
        page = open url
        html = Nokogiri::HTML page
        @kit = IMGKit.new(html)
        img = @kit.to_img(:jpg)
        file = File.new("#{::Rails.root}/app/assets/images/"+i.to_s()+".jpg", "w+", :encoding => 'ascii-8bit')
        file.write(img)
        @files[i] = i.to_s()+".jpg" 
        @urls[i] = url
        i+=1
break
        rescue
        break
        end
      end

  end
    
  end
end
