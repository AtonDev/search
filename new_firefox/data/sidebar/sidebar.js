var table = document.getElementById("table");

addon.port.on('update_content', function(data) {
  //containers = document.getElementByClassName('containers');
  //for (c)
  table.innerHTML=""
  for (var i = 0; i < data.urls.length; i++) {
    addTableElement(data.urls[i], data.dispurls[i], data.titles[i], data.abstracts[i], data.loadedIdx, i)
  };
  smoothScrollTo(document.getElementById("selected").offsetTop, 1)
})

addon.port.on('select_box', function(index) {
  selectBoxAt(index)
})

addon.port.on('get_selected', function() {
  loadUrl(null)
  //addon.port.emit('selected_index', idx)
})

//test data
/*
var s_data = {"urls":["http://en.wikipedia.org/wiki/Albert_Einstein","http://www.einsteinbros.com/","http://www.nobelprize.org/nobel_prizes/physics/laureates/1921/einstein-bio.html","http://www.einstein.edu/","http://www.space.com/15524-albert-einstein.html","http://www.einstein.edu/careers/","http://www.biography.com/people/albert-einstein-9285408","http://www.amnh.org/exhibitions/past-exhibitions/einstein","http://www.pbs.org/wgbh/nova/physics/einstein-big-idea.html","http://www.brainyquote.com/quotes/authors/a/albert_einstein.html","http://einstein.biz/","http://www.einstein.yu.edu/","http://www.history.com/topics/albert-einstein","http://library.einstein.yu.edu/","http://www.quotationspage.com/quotes/Albert_Einstein","http://www.paulcbuff.com/e640.php","http://www.amazon.com/Einstein-Life-Universe-Walter-Isaacson/dp/1442348062","http://www.rottentomatoes.com/celebrity/albert_einstein/","http://einstein.biz/biography.php","http://en.wikiquote.org/wiki/Albert_Einstein","http://rescomp.stanford.edu/~cheshire/EinsteinQuotes.html","http://www.goodreads.com/quotes/tag/einstein","https://advance.einstein.edu/","http://einstein.bidshift.com/","http://inventors.about.com/library/inventors/bleinstein.htm","http://kidsii.com/babyeinstein/","http://www.westegg.com/einstein/","http://www.einsteinbros.com/join-the-club","http://www.youtube.com/user/babyeinstein","http://spaceandmotion.com/albert-einstein-god-religion-theology.htm","http://www.alberteinsteinsite.com/quotes/einsteinquotes.html","http://etcweb.princeton.edu/CampusWWW/Companion/einstein_albert.html","http://aip.org/history/einstein/","http://www.alberteinstein.info/","http://www.snopes.com/religion/einstein.asp","http://www.einstein-quotes.com/","https://iqhealth.einstein.edu/","http://www.britannica.com/EBchecked/topic/181349/Albert-Einstein","http://www.pbs.org/wgbh/nova/physics/einstein-genius-among-geniuses.html","http://www.who2.com/bio/albert-einstein","http://history1900s.about.com/od/people/a/Einstein.htm","http://www.amnh.org/explore/ology/einstein","http://backtothefuture.wikia.com/wiki/Einstein","http://everythingforever.com/einstein.htm","http://csep10.phys.utk.edu/astr161/lect/history/einstein.html","http://plato.stanford.edu/entries/einstein-philscience/","http://einstein.phys.uwm.edu/","http://science.howstuffworks.com/innovation/famous-inventors/what-did-albert-einstein-invent.htm","http://einstein.com/","http://dictionary.reference.com/browse/einstein?s=t"],"dispurls":["en.wikipedia.org/wiki/\u003Cb\u003EAlbert_Einstein\u003C/b\u003E","www.\u003Cb\u003Eeinstein\u003C/b\u003Ebros.com","www.nobelprize.org/.../laureates/1921/\u003Cb\u003Eeinstein\u003C/b\u003E-bio.html","www.\u003Cb\u003Eeinstein\u003C/b\u003E.edu","www.space.com/15524-albert-\u003Cb\u003Eeinstein\u003C/b\u003E.html","www.\u003Cb\u003Eeinstein\u003C/b\u003E.edu/careers","www.biography.com/people/\u003Cb\u003Ealbert-einstein\u003C/b\u003E-9285408","www.amnh.org/exhibitions/past-exhibitions/\u003Cb\u003Eeinstein\u003C/b\u003E","www.pbs.org/wgbh/nova/physics/\u003Cb\u003Eeinstein\u003C/b\u003E-big-idea.html","www.brainyquote.com/quotes/authors/a/albert","\u003Cb\u003Eeinstein\u003C/b\u003E.biz","www.\u003Cb\u003Eeinstein\u003C/b\u003E.yu.edu","www.history.com/topics/\u003Cb\u003Ealbert-einstein\u003C/b\u003E","library.\u003Cb\u003Eeinstein\u003C/b\u003E.yu.edu","www.quotationspage.com/quotes/\u003Cb\u003EAlbert_Einstein\u003C/b\u003E","www.paulcbuff.com/e640.php","www.amazon.com/\u003Cb\u003EEinstein\u003C/b\u003E-Life-Universe-Walter-Isaacson/dp/...","www.rottentomatoes.com/celebrity/\u003Cb\u003Ealbert_einstein\u003C/b\u003E","\u003Cb\u003Eeinstein\u003C/b\u003E.biz/biography.php","en.wikiquote.org/wiki/Albert_\u003Cb\u003EEinstein\u003C/b\u003E","rescomp.stanford.edu/~cheshire/\u003Cb\u003EEinstein\u003C/b\u003EQuotes.html","www.goodreads.com/quotes/tag/\u003Cb\u003Eeinstein\u003C/b\u003E","https://advance.\u003Cb\u003Eeinstein\u003C/b\u003E.edu","\u003Cb\u003Eeinstein\u003C/b\u003E.bidshift.com","inventors.about.com/library/inventors/bl\u003Cb\u003Eeinstein\u003C/b\u003E.htm","kidsii.com/\u003Cb\u003Ebabyeinstein\u003C/b\u003E","www.westegg.com/\u003Cb\u003Eeinstein\u003C/b\u003E","www.\u003Cb\u003Eeinstein\u003C/b\u003Ebros.com/join-the-club","www.youtube.com/user/\u003Cb\u003Ebabyeinstein\u003C/b\u003E","www.spaceandmotion.com/albert-\u003Cb\u003Eeinstein\u003C/b\u003E-god-religion","www.\u003Cb\u003Ealberteinsteins\u003C/b\u003Eite.com/quotes/\u003Cb\u003Eeinstein\u003C/b\u003Equotes.html","etcweb.princeton.edu/CampusWWW/Companion/\u003Cb\u003Eeinstein\u003C/b\u003E_albert...","aip.org/\u003Cb\u003Ehistory\u003C/b\u003E/\u003Cb\u003Eeinstein\u003C/b\u003E","www.\u003Cb\u003Ealberteinstein\u003C/b\u003E.info","www.snopes.com/religion/\u003Cb\u003Eeinstein\u003C/b\u003E.asp","www.\u003Cb\u003Eeinstein\u003C/b\u003E-\u003Cb\u003Equotes\u003C/b\u003E.com","https://iqhealth.\u003Cb\u003Eeinstein\u003C/b\u003E.edu","www.britannica.com/EBchecked/topic/181349","www.pbs.org/wgbh/nova/physics/\u003Cb\u003Eeinstein\u003C/b\u003E-genius-among...","www.who2.com/bio/\u003Cb\u003Ealbert-einstein\u003C/b\u003E","history1900s.about.com/od/people/a/\u003Cb\u003EEinstein\u003C/b\u003E.htm","www.amnh.org/explore/ology/\u003Cb\u003Eeinstein\u003C/b\u003E","\u003Cb\u003Ebacktothefuture\u003C/b\u003E.wikia.com/wiki/\u003Cb\u003EEinstein\u003C/b\u003E","everythingforever.com/\u003Cb\u003Eeinstein\u003C/b\u003E.htm","csep10.phys.utk.edu/astr161/lect/history/\u003Cb\u003Eeinstein\u003C/b\u003E.html","plato.stanford.edu/entries/\u003Cb\u003Eeinstein\u003C/b\u003E-philscience","\u003Cb\u003Eeinstein\u003C/b\u003E.phys.uwm.edu","science.howstuffworks.com/...did-albert-\u003Cb\u003Eeinstein\u003C/b\u003E-invent.htm","\u003Cb\u003Eeinstein\u003C/b\u003E.com","dictionary.reference.com/browse/\u003Cb\u003Eeinstein\u003C/b\u003E?s=t"],"titles":["\u003Cb\u003EAlbert Einstein\u003C/b\u003E - Wikipedia, the free encyclopedia","\u003Cb\u003EEinstein\u003C/b\u003E Bros. Bagels - Fresh Bagels, Bagel Sandwiches ...","\u003Cb\u003EAlbert Einstein\u003C/b\u003E - Biographical - Nobelprize.org","\u003Cb\u003EEinstein\u003C/b\u003E Medical Center - \u003Cb\u003EEinstein\u003C/b\u003E Healthcare Network ...","Albert \u003Cb\u003EEinstein\u003C/b\u003E: Theories, Facts, IQ and Quotes","Careers — \u003Cb\u003EEinstein\u003C/b\u003E Healthcare. - \u003Cb\u003EEinstein\u003C/b\u003E Medical Center","\u003Cb\u003EAlbert Einstein\u003C/b\u003E - Physicist,Scientist - Biography - Facts ...","\u003Cb\u003EEinstein\u003C/b\u003E - AMNH","NOVA | \u003Cb\u003EEinstein's\u003C/b\u003E Big Idea - PBS","\u003Cb\u003EAlbert Einstein\u003C/b\u003E Quotes - BrainyQuote - Famous Quotes at ...","\u003Cb\u003EAlbert\u003C/b\u003E \u003Cb\u003EEinstein\u003C/b\u003E | \u003Cb\u003EAlbert\u003C/b\u003E \u003Cb\u003EEinstein\u003C/b\u003E Official Site","\u003Cb\u003EAlbert Einstein\u003C/b\u003E College of Medicine | Medical Education ...","\u003Cb\u003EAlbert Einstein\u003C/b\u003E - Facts \u0026amp; Summary - HISTORY.com","D. Samuel Gottesman Library - Albert \u003Cb\u003EEinstein\u003C/b\u003E College of ...","\u003Cb\u003EAlbert Einstein\u003C/b\u003E Quotes - The Quotations Page","Paul C. Buff - \u003Cb\u003EEinstein\u003C/b\u003E E640","\u003Cb\u003EEinstein\u003C/b\u003E: His Life and Universe: Walter Isaacson, Edward ...","\u003Cb\u003EAlbert Einstein\u003C/b\u003E - Rotten Tomatoes: Movies | TV Shows ...","\u003Cb\u003EAlbert Einstein\u003C/b\u003E | \u003Cb\u003EAlbert Einstein\u003C/b\u003E Official Site - Bio","Albert \u003Cb\u003EEinstein\u003C/b\u003E - Wikiquote","Collected Quotes from Albert \u003Cb\u003EEinstein\u003C/b\u003E - Stanford University","Quotes About \u003Cb\u003EEinstein\u003C/b\u003E (86 quotes) - Goodreads","Home - \u003Cb\u003EEinstein\u003C/b\u003E Healthcare Network - \u003Cb\u003EEinstein\u003C/b\u003E Medical Center","API Healthcare - BidShift","\u003Cb\u003EAlbert Einstein\u003C/b\u003E Biography - The Life and Achievements of ...","\u003Cb\u003EBaby Einstein\u003C/b\u003E \u0026gt; Home - Kids II \u0026gt; Home Page","\u003Cb\u003EAlbert Einstein\u003C/b\u003E Online - The Homepage du jour of S. Morgan ...","\u003Cb\u003EEinstein\u003C/b\u003E Bros E-Club - Fresh Bagels, Bagel Sandwiches, Coffee ...","\u003Cb\u003EBaby Einstein\u003C/b\u003E - YouTube","Albert \u003Cb\u003EEinstein\u003C/b\u003E: Quotes on God, Religion, Theology","\u003Cb\u003EEinstein\u003C/b\u003E Quotes - Quotes by \u003Cb\u003EAlbert Einstein\u003C/b\u003E","\u003Cb\u003EEinstein\u003C/b\u003E, Albert - Princeton University","\u003Cb\u003EEinstein\u003C/b\u003E-Image and Impact. AIP \u003Cb\u003EHistory\u003C/b\u003E Center exhibit.","\u003Cb\u003EAlbert\u003C/b\u003E \u003Cb\u003EEinstein\u003C/b\u003E Archives","snopes.com: \u003Cb\u003EAlbert Einstein\u003C/b\u003E Humiliates Atheist","\u003Cb\u003EEinstein\u003C/b\u003E \u003Cb\u003EQuotes\u003C/b\u003E","Patient Log In — \u003Cb\u003EEinstein\u003C/b\u003E Healthcare. - \u003Cb\u003EEinstein\u003C/b\u003E Medical Center","Albert \u003Cb\u003EEinstein\u003C/b\u003E (German-American physicist) -- Encyclopedia ...","NOVA | \u003Cb\u003EEinstein\u003C/b\u003E: Genius Among Geniuses - PBS","\u003Cb\u003EAlbert Einstein\u003C/b\u003E Biography - Birthday, Photos - Who2.com","Albert \u003Cb\u003EEinstein\u003C/b\u003E - Biography - About.com 20th Century History","\u003Cb\u003EEinstein\u003C/b\u003E - AMNH","\u003Cb\u003EEinstein\u003C/b\u003E - Futurepedia - The \u003Cb\u003EBack to the Future\u003C/b\u003E Wiki","Albert \u003Cb\u003EEinstein\u003C/b\u003E and the Fabric of Time - Everything Forever","Albert \u003Cb\u003EEinstein\u003C/b\u003E and the Theory of Relativity","\u003Cb\u003EEinstein's\u003C/b\u003E Philosophy of Science (Stanford Encyclopedia of ...","\u003Cb\u003EEinstein\u003C/b\u003E@Home","HowStuffWorks \"What did \u003Cb\u003EAlbert Einstein\u003C/b\u003E invent?\"","\u003Cb\u003Eeinstein\u003C/b\u003E.com","\u003Cb\u003EEinstein\u003C/b\u003E | Define \u003Cb\u003EEinstein\u003C/b\u003E at Dictionary.com"],"abstracts":["Albert \u003Cb\u003EEinstein\u003C/b\u003E was a German-born theoretical physicist. He developed the general theory of relativity, one of the two pillars of modern physics (alongside ...","Get Bagels Here! \u003Cb\u003EEinstein\u003C/b\u003E Bros Bagels – the best bagels, bagel sandwiches, breakfast sandwiches, coffee \u0026amp; espresso, salads and more. Breakfast, Lunch, Catering!","\u003Cb\u003EAlbert Einstein\u003C/b\u003E - Biographical. Questions and Answers on \u003Cb\u003EAlbert Einstein\u003C/b\u003E. \u003Cb\u003EAlbert Einstein\u003C/b\u003E was born at Ulm, in Württemberg, Germany, on March 14, 1879.","Philadelphia’s largest independent Academic Medical Center with 7 hospitals in the Philadelphia \u0026amp; Montgomery Area.","Albert \u003Cb\u003EEinstein\u003C/b\u003E profoundly changed physics and ideas about space and time. Learn his theories, find facts and quotes from the man with an IQ of 160.","\u003Cb\u003EEinstein\u003C/b\u003E Healthcare Network selects employees on the basis of skill, knowledge, values and experience. Our network seeks diversity on the basis of national origin ...","Biography.com offers a glimpse into the life of \u003Cb\u003EAlbert Einstein\u003C/b\u003E, the most influential physicist of the 20th century, who developed the theory of relativity.","Albert \u003Cb\u003EEinstein\u003C/b\u003E reinterpreted the inner workings of nature, the very essence of light, time, energy and gravity. His insights fundamentally changed the way we look at ...","\u003Cb\u003EEinstein's\u003C/b\u003E Big Idea. PBS Airdate: October 11, 2005. NARRATOR: When we think of E = mc2 we have this vision of \u003Cb\u003EEinstein\u003C/b\u003E as an old wrinkly man with white hair.","Enjoy the best \u003Cb\u003EAlbert Einstein\u003C/b\u003E Quotes at BrainyQuote. Quotations by \u003Cb\u003EAlbert Einstein\u003C/b\u003E, German Physicist, Born March 14, 1879. Share with your friends.","\u003Cb\u003EAlbert\u003C/b\u003E \u003Cb\u003EEinstein\u003C/b\u003E official Web Site and Fan Club, featuring biography, photos, trivia, rights representation, licensing, contact and more.","\u003Cb\u003EAlbert Einstein\u003C/b\u003E College of Medicine is one of the nation’s premier institutions for medical education, basic research and clinical investigation.","Find out more about the history of \u003Cb\u003EAlbert Einstein\u003C/b\u003E, including videos, interesting articles, pictures, historical features and more. Get all the facts on HISTORY.com","Beginning this week, the websites of The Journal of Clinical Psychiatry and Psychiatrist.com will begin migrating to a new platform that will allow them to provide ...","\u003Cb\u003EAlbert Einstein\u003C/b\u003E Few people are capable of expressing with equanimity opinions which differ from the prejudices of their social environment. Most people are even ...","We are pleased to present the most advanced integrated studio flash system ever conceived - \u003Cb\u003EEinstein\u003C/b\u003E™. \u003Cb\u003EEinstein\u003C/b\u003E™ is a powerful, all-digital, self-contained flash ...","By the author of the acclaimed bestsellers Benjamin Franklin and Steve Jobs, this is the definitive biography of Albert \u003Cb\u003EEinstein\u003C/b\u003E. How did his mind work?","\u003Cb\u003EAlbert Einstein\u003C/b\u003E Celebrity Profile - Check out the latest \u003Cb\u003EAlbert Einstein\u003C/b\u003E photo gallery, biography, pics, pictures, interviews, news, forums and blogs at Rotten Tomatoes!","\u003Cb\u003EAlbert Einstein\u003C/b\u003E official Web Site and Fan Club, featuring biography, photos, trivia, rights representation, licensing, contact and more.","Albert \u003Cb\u003EEinstein\u003C/b\u003E (14 March 1879 – 18 April 1955) was a theoretical physicist widely regarded as one of the most influential scientists of all time.","[Note: This list of \u003Cb\u003EEinstein\u003C/b\u003E quotes was being forwarded around the Internet in e-mail, so I decided to put it on my web page. I'm afraid I can't vouch for its ...","86 quotes have been tagged as \u003Cb\u003Eeinstein\u003C/b\u003E: Albert \u003Cb\u003EEinstein\u003C/b\u003E: ‘If a cluttered desk is a sign of a cluttered mind, of what, then, is an empty desk a sign?’, Al...","Be Inspired: Why do people give to \u003Cb\u003EEinstein\u003C/b\u003E? Perhaps it's an important cause close to their heart that they know we also care about. Perhaps they enjoyed a positive ...","Your Shift is Just a Click Away. Albert \u003Cb\u003EEinstein\u003C/b\u003E Healthcare Network is pleased to offer \u003Cb\u003EEinstein\u003C/b\u003E BidShift to all nursing employees within Albert \u003Cb\u003EEinstein\u003C/b\u003E Healthcare ...","By Mary Bellis. Photo: \u003Cb\u003EAlbert Einstein\u003C/b\u003E. \u003Cb\u003EAlbert Einstein\u003C/b\u003E was born in Germany in 1879. He enjoyed classical music and played the violin. One story \u003Cb\u003EEinstein\u003C/b\u003E liked to ...","3333 Piedmont Road Northeast #1800, Atlanta, GA 30305 Phone: (770)751-0442","A Message From Morgan This is Morgan, creator of \u003Cb\u003EAlbert Einstein\u003C/b\u003E Online. I just wanted to thank you for using the site, and tell you that if you like this Website ...","Do you love our Bagels as much as we do? Join the club today and enjoy exclusive deals throughout the year. You will also be the first to know about our latest ...","The official YouTube channel for \u003Cb\u003EBaby Einstein\u003C/b\u003E. Click on the links below to check out the official \u003Cb\u003EBaby Einstein\u003C/b\u003E website, Facebook page, Blog and follow us o...","Theology of Albert \u003Cb\u003EEinstein\u003C/b\u003E: Discussion of quotes by Albert \u003Cb\u003EEinstein\u003C/b\u003E on Philosophy of Religion, Theology, Jews, Anti-semitism, Religion vs. Science, God.","\u003Cb\u003EEinstein\u003C/b\u003E Quotes. The most comprehensive collection of \u003Cb\u003EAlbert Einstein\u003C/b\u003E quotes online. This website, www.alberteinsteinsite.com, is dedicated to the physicist Albert ...","\u003Cb\u003EEinstein\u003C/b\u003E, Albert \u003Cb\u003EEinstein\u003C/b\u003E, Albert (1879-1955) first visited Princeton in 1921 -- the year before he received the Nobel Prize -- to deliver five Stafford Little ...","\u003Cb\u003EEinstein's\u003C/b\u003E life and thought -by leading historians with many illustrations - his theories, political concerns, and impact. From the AIP Center for \u003Cb\u003EHistory\u003C/b\u003E of Physics.","The homepage of the repository of the personal papers of the great scientist, humanist and Jew, \u003Cb\u003EAlbert\u003C/b\u003E \u003Cb\u003EEinstein\u003C/b\u003E","Anecdote claims \u003Cb\u003EAlbert Einstein\u003C/b\u003E humiliated an atheist professor by using the 'Evil is the absence of God' argument on him.","Welcome to \u003Cb\u003EEinstein\u003C/b\u003E \u003Cb\u003EQuotes\u003C/b\u003E Dedicated to the sensible person behind the scientist. This website is dedicated to the wisdom of \u003Cb\u003EEinstein\u003C/b\u003E. Browse our \u003Cb\u003Equotes\u003C/b\u003E' categories ...","Sign in to MY \u003Cb\u003EEinstein\u003C/b\u003E Health Portal. Already have a MY \u003Cb\u003EEinstein\u003C/b\u003E Health account? Sign in to the MY \u003Cb\u003EEinstein\u003C/b\u003E Health Portal above. Register for MY \u003Cb\u003EEinstein\u003C/b\u003E Health","Childhood and education. \u003Cb\u003EEinstein\u003C/b\u003E’s parents were secular, middle-class Jews. His father, Hermann \u003Cb\u003EEinstein\u003C/b\u003E, was originally a featherbed salesman and later ran an ...","\u003Cb\u003EEinstein\u003C/b\u003E: Genius Among Geniuses. By Thomas Levenson; Posted 09.09.97; NOVA; There is a parlor game physics students play: Who was the greater genius? Galileo or Kepler?","Thanks to his theory of relativity, \u003Cb\u003EAlbert Einstein\u003C/b\u003E became the most famous scientist of the 20th century. In 1905, while working in a Swiss patent office, \u003Cb\u003EEinstein\u003C/b\u003E ...","Albert \u003Cb\u003EEinstein\u003C/b\u003E (1879 - 1955), the German-Swiss-American mathematical atomic physicist and Nobel prizewinner, seen early in his career in a thoughtful pose.","Photos: \u003Cb\u003EEinstein\u003C/b\u003E pledging (1940): courtesy of Hulton Archive/Getty; Time Magazine Cover: Time Magazine Cover; All other \u003Cb\u003EEinstein\u003C/b\u003E images: courtesy of the Albert ...","\u003Cb\u003EEinstein\u003C/b\u003E was a major character in the animated series. He underwent a bit of a transformation, with the cartoon version not looking that much the film version.","Albert \u003Cb\u003EEinstein\u003C/b\u003E and the Fabric of Time. Surprising as it may be to most non-scientists and even to some scientists, Albert \u003Cb\u003EEinstein\u003C/b\u003E concluded in his later years that ...","Newton's theory of gravitation was soon accepted without question, and it remained unquestioned until the beginning of this century. Then Albert \u003Cb\u003EEinstein\u003C/b\u003E shook the ...","Albert \u003Cb\u003EEinstein\u003C/b\u003E (1879–1955) is well known as the most prominent physicist of the twentieth century. Less well known, though of comparable importance, are ...","\u003Cb\u003EEinstein\u003C/b\u003E@Home Volunteers Discover Four \"Young\" Gamma-Ray Pulsars Congratulations to our volunteers: Thomas M. Jackson, Kentucky, USA Mak-ino, Japan","What did \u003Cb\u003EAlbert Einstein\u003C/b\u003E invent? Find out exactly what he did to help form some of the greatest inventions known to man with this HowStuffWorks article.","\u003Cb\u003Eeinstein\u003C/b\u003E.com","\u003Cb\u003EEinstein\u003C/b\u003E (ˈaɪnstaɪn) —n: Albert. 1879--1955, US physicist and mathematician, born in Germany. He formulated the special theory of relativity (1905) and the ..."]}
for (var i = 0; i < s_data.urls.length; i++) {
  addTableElement(s_data.urls[i], s_data.dispurls[i], s_data.titles[i], s_data.abstracts[i])
};*/
//end test data

//test

window.smoothScrollTo = (function () {
  var timer, start, factor;
  
  return function (target, duration) {
    var offset = window.pageYOffset,
        delta  = target - window.pageYOffset; // Y-offset difference
    duration = duration || 1000;              // default 1 sec animation
    start = Date.now();                       // get start time
    factor = 0;
    
    if( timer ) {
      clearInterval(timer); // stop any running animations
    }
    
    function step() {
      var y;
      factor = (Date.now() - start) / duration; // get interpolation factor
      if( factor >= 1 ) {
        clearInterval(timer); // stop animation
        factor = 1;           // clip to max 1.0
      } 
      y = factor * delta + offset;
      window.scrollBy(0, y - window.pageYOffset);
    }
    
    timer = setInterval(step, 10);
    return timer;
  };
}());

//end test

function addTableElement(url, dispurl, title, abstract, current_idx, idx) {
  var container = document.createElement("div")
  var titlePar = document.createElement("p")
  var dispurlPar = document.createElement("p")
  var abstractPar = document.createElement("p")
  var indexPar = document.createElement("p")
  var urlPar = document.createElement("p")

  if (idx == current_idx) {
    container.id = "selected"
  }

  container.className = 'containers'
  titlePar.className = 'titles'
  dispurlPar.className = 'dispurls'
  abstractPar.className = 'abstracts'
  indexPar.className = 'indexes'
  urlPar.className = 'urls'


  titlePar.innerHTML = title
  dispurlPar.innerHTML = dispurl
  abstractPar.innerHTML = abstract
  indexPar.innerHTML = idx
  urlPar.innerHTML = url

  container.appendChild(titlePar)
  container.appendChild(dispurlPar)
  container.appendChild(abstractPar)
  container.appendChild(urlPar)
  container.appendChild(indexPar)

  info = JSON.stringify({"idx":idx, "url":url})
  container.setAttribute('onclick', "handleClick("+ info +")")

  table.appendChild(container)
}

function handleClick(info) {
  selectBoxAt(info.idx)
  loadUrl(info)
}

function selectBoxAt(index) {
  var old = document.getElementById("selected")
    if (old) {old.id = ""}
    var containers = document.getElementsByClassName('containers')
    containers[index].id = "selected"
    smoothScrollTo(containers[index].offsetTop, 700)
}

function loadUrl(info) {
  if (!info) {
    info = {"idx":0, "url":""}
    var selected = document.getElementById("selected")
    for (var i = 0; i < selected.childNodes.length; i++) {
      var child = selected.childNodes[i]
      if (child.className == "urls") {
        info.url = child.innerHTML
      } else if (child.className == "indexes") {
        info.idx = parseInt(child.innerHTML)
      }
    }  
  }
  addon.port.emit('load_url', info)
}