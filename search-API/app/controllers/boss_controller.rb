class BossController < ApplicationController

  def get_boss_results
    query = params["search"]

    #BOSS stuff----

    #--------------

    urls = ["http://en.wikipedia.org/wiki/Arturo"]
    render :json => {urls: urls}
  end


end
