var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 400,
        videoId: 'EjMNNpIksaI',
        playerVars: {
            color: 'white'
        },
        events: {
            onReady: play
        }
    });
}

function play(){
	player.playVideo();
	$("#play,#pause").hide();
	$("#pause").show();
}

function pause(){
	player.pauseVideo();
	$("#play,#pause").hide();
	$("#play").show();
}

function pausePlay(){
	if($("#play").is(":visible")){
		play();
	}else{
		pause();
	}
}

$(document).ready(function(){
	var MOUSE_HOVER_SPEED = 10;

	var scrollSpeed = localStorage.getItem("scrollSpeed");
	var mouseHover = localStorage.getItem("mouseHover");
	if(!scrollSpeed){
		scrollSpeed = 6;
		localStorage.setItem("scrollSpeed",scrollSpeed);
	}

	if(!mouseHover){
		mouseHover = "slow";
		localStorage.setItem("mouseHover",mouseHover);
	}

	$(".scroll-speed").val(11-scrollSpeed);
	setTimeout(function(){
		$(".logo-text,#start").remove();
	},(parseInt(scrollSpeed)+3)*1000);

	applyScrollSpeed(parseInt(scrollSpeed), false);
	$("#"+mouseHover).prop("checked", true);

	$(".settings-wrapper").click(function(){
		if($(".callout").is(":visible") && $(event.target).parents(".callout").size()==0){
			$(".callout").hide();
		}else{
			$(".callout").show();
		}
	});

	$(".about-wrapper").click(function(){
		if($(".callout-about").is(":visible") && $(event.target).parents(".callout-about").size()==0){
			$(".callout-about").hide();
		}else{
			$(".callout-about").show();
		}
	});

	$("body").click(function(event){
        debugger;
        if($(event.target).attr("class")!="settings" && $(event.target).parents(".callout").size()==0 && $(event.target).attr("class")!="callout"){
            $(".callout").hide();
            if($(event.target).parents("#titles").size()==0 && $(".info").attr("sticky")=="yes"){
                $(".info-close").trigger("click");
            }
        }

        else if($(event.target).attr("class")!="about" && $(event.target).parents(".callout-about").size()==0 && $(event.target).attr("class")!="callout-about") {
            $(".callout-about").hide();
        }

        else if($(event.target).attr("class")=="modal"){
            $("#contactModal").hide();
        }

	});

	$(".speed-control#minus").click(function(){
		scrollSpeed = parseInt(localStorage.getItem("scrollSpeed"));
		scrollSpeed--;
		localStorage.setItem("scrollSpeed",scrollSpeed);
		applyScrollSpeed(scrollSpeed, 1);
		$(".scroll-speed").val(11-scrollSpeed);
	});

	$(".speed-control#plus").click(function(){
		scrollSpeed = parseInt(localStorage.getItem("scrollSpeed"));
		scrollSpeed++;
		localStorage.setItem("scrollSpeed",scrollSpeed);
		applyScrollSpeed(scrollSpeed, -1);
		$(".scroll-speed").val(11-scrollSpeed);
	});

	$("input[name='radioDark']").click(function(){
		localStorage.setItem("mouseHover",$(this).val());
	});

	$("#titles ol").mouseenter(function(){
		if(localStorage.getItem("mouseHover")=="slow"){
			applyScrollSpeed(10,-1);
		}else{
			$("#titlecontent").css("animation-play-state","paused");
		}
	});

	$("#titles ol").mouseleave(function(){
        if(localStorage.getItem("mouseHover")=="slow"){
			var scrollSpeed = localStorage.getItem("scrollSpeed");
			applyScrollSpeed(parseInt(scrollSpeed),1);
		}else{
            if($(".info").attr("sticky")!="yes"){
                $("#titlecontent").css("animation-play-state","running");
            }
		}
	});

	$("#titles li").mouseover(function(){
		//var pubMedId = "14522753";
        //Don't change anything if the message is already sticky
        if($(".info").attr("sticky")=="yes"){
            return;
        }
		var pubMedId = $(this).attr("data-pmid");
		var url, linkText;
		switch(pubMedId){
			case "S0005789488800273":
				url = "http://www.sciencedirect.com/science/article/pii/S0005789488800273";
				linkText = "Link";
				break;
			case "NCJ 092810":
				url = "https://www.ncjrs.gov/App/publications/Abstract.aspx?id=92810";
				linkText = "Link";
				break;
			default:
				url = "https://www.ncbi.nlm.nih.gov/pubmed/"+pubMedId;
				linkText = "PubMed";
		}
		var ref = DATA_JSON[pubMedId];
		$(".info")
		.show()
		.find(".msg")
		.html(ref.author+". ("+ref.pubdate+"). "+ref.title+" "+ref.source+", "+ref.volume+"("+ref.issue+"), "+ref.pages+"<br/><a target='_blank' href='"+url+"'>"+linkText+"</a>");
		$("#titles li").css("border","2px solid black");
		$(this).css("border","2px solid #ffff66");
	});

	$("#titles li").click(function(){
        //Don't change any selection if already one is selected
        if($(".info").attr("sticky")=="yes"){
            return;
        }
		$(".info").attr("sticky","yes");
		$("#titles li").css("border","2px solid black");
		$(this).css("border","2px solid #ffff66");
        if(localStorage.getItem("mouseHover")=="stop"){
            $("#titlecontent").css("animation-play-state","paused");
        }
	});

	$("#titles li").mouseout(function(){
		if(!$(".info").attr("sticky")){
			$(".info").hide();
			$(this).css("border","2px solid black");
		}
	});

	$(".info-close").click(function(){
		$(".info").removeAttr("sticky").hide();
        $("#titles li").css("border","2px solid black");
        $("#titlecontent").css("animation-play-state","running");
        var scrollSpeed = localStorage.getItem("scrollSpeed");
        applyScrollSpeed(parseInt(scrollSpeed),1);
	});

	function applyScrollSpeed(scrollSpeed, delayCalculation){
		if(scrollSpeed<=1){
			$(".speed-control#minus").prop("disabled",true);
		}else{
			$(".speed-control#minus").prop("disabled",false);
		}

		if(scrollSpeed>=10){
			$(".speed-control#plus").prop("disabled",true);
		}else{
			$(".speed-control#plus").prop("disabled",false);
		}

		if(!delayCalculation){
			$("#titlecontent").css("animation-duration",(scrollSpeed*86)+"s");
			$(".logo-text").css("animation-duration", scrollSpeed+"s");
		}else{
			$("#titlecontent").css("animation-play-state","paused");
			var elem = document.getElementById("titlecontent");
		    var actualTop = parseFloat(window.getComputedStyle(elem,null).getPropertyValue("top").replace("px",""));
		    $("#titlecontent").css("animation-duration",(scrollSpeed*86)+"s");
			$(".logo-text").css("animation-duration", scrollSpeed+"s");
			var computedTop = parseFloat(window.getComputedStyle(elem,null).getPropertyValue("top").replace("px",""));

			while(Math.abs(computedTop-actualTop) > 20){
				var delay = parseFloat($("#titlecontent").css("animation-delay").replace("s",""));
				$("#titlecontent").css("animation-delay",(delay+0.05*delayCalculation)+"s");
				computedTop = parseFloat(window.getComputedStyle(elem,null).getPropertyValue("top").replace("px",""));
				//console.log(actualTop,computedTop);
			}
			$("#titlecontent").css("animation-play-state","running");
		}
	}

  $(".share-icons img").click(function(){
    var type = $(this).attr("type");
    switch(type){
      case "facebook":
        window.open("https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fsugarwars.com", "_blank", "width=500,height=400");
      break;
      case "twitter":
        window.open("https://twitter.com/intent/tweet?url=http%3A%2F%2Fsugarwars.com&text=May%20the%20force%20(of%20health)%20be%20with%20you.&original_referer=http%3A%2F%2Fsugarwars.com", "_blank", "width=500,height=400");
      break;
      case "google-plus":
        window.open("https://plus.google.com/share?url=http%3A%2F%2Fsugarwars.com", "_blank", "width=500,height=400");
      break;
    }
  });


  $(".contact-icon").click(function(){
    $("#contactModal").show();
    setTimeout(function(){
      $(".callout-about").hide();
    },10);
  });

  $(".modal .close").click(function(){
    $("#contactModal").hide();
  });

});


var DATA_JSON = {
  "14522753": {
    "title": "Sugars and dental caries.",
    "author": "Touger-Decker R",
    "source": "Am J Clin Nutr",
    "pubdate": "2003 Oct",
    "volume": "78",
    "issue": "4",
    "pages": "881S-892S"
  },
  "87628": {
    "title": "Food allergies and migraine.",
    "author": "Grant EC",
    "source": "Lancet",
    "pubdate": "1979 May 5",
    "volume": "1",
    "issue": "8123",
    "pages": "966-9"
  },
  "3214134": {
    "title": "Dietary sucrose and oestradiol concentration in young men.",
    "author": "Yudkin J",
    "source": "Ann Nutr Metab",
    "pubdate": "1988",
    "volume": "32",
    "issue": "2",
    "pages": "53-5"
  },
  "3313137": {
    "title": "Metabolic changes induced by sugar in relation to coronary heart disease and diabetes.",
    "author": "Yudkin J",
    "source": "Nutr Health",
    "pubdate": "1987",
    "volume": "5",
    "issue": "1-2",
    "pages": "5-8"
  },
  "3313140": {
    "title": "Sucrose and idiopathic renal stone.",
    "author": "Blacklock NJ",
    "source": "Nutr Health",
    "pubdate": "1987",
    "volume": "5",
    "issue": "1-2",
    "pages": "9-17"
  },
  "3713513": {
    "title": "Effects of diets high in simple sugars on urinary chromium losses.",
    "author": "Kozlovsky AS",
    "source": "Metabolism",
    "pubdate": "1986 Jun",
    "volume": "35",
    "issue": "6",
    "pages": "515-8"
  },
  "3782627": {
    "title": "Behavioral effects of sucrose on preschool children.",
    "author": "Goldman JA",
    "source": "J Abnorm Child Psychol",
    "pubdate": "1986 Dec",
    "volume": "14",
    "issue": "4",
    "pages": "565-77"
  },
  "6424754": {
    "title": "Diet, alcohol, and relative weight in gall stone disease: a case-control study.",
    "author": "Scragg RK",
    "source": "Br Med J (Clin Res Ed)",
    "pubdate": "1984 Apr 14",
    "volume": "288",
    "issue": "6424",
    "pages": "1113-9"
  },
  "7437813": {
    "title": "Effects of high dietary sugar.",
    "author": "Yudkin J",
    "source": "Br Med J",
    "pubdate": "1980 Nov 22",
    "volume": "281",
    "issue": "6252",
    "pages": "1396"
  },
  "7489774": {
    "title": "A case-control study of gastric cancer and nutritional factors in Marseille, France.",
    "author": "CornÃ©e J",
    "source": "Eur J Epidemiol",
    "pubdate": "1995 Feb",
    "volume": "11",
    "issue": "1",
    "pages": "55-65"
  },
  "7866810": {
    "title": "Dietary habits as risk factors for inflammatory bowel disease.",
    "author": "Tragnone A",
    "source": "Eur J Gastroenterol Hepatol",
    "pubdate": "1995 Jan",
    "volume": "7",
    "issue": "1",
    "pages": "47-51"
  },
  "8123778": {
    "title": "Sugar, meat, and fat intake, and non-dietary risk factors for colon cancer incidence in Iowa women (United States).",
    "author": "Bostick RM",
    "source": "Cancer Causes Control",
    "pubdate": "1994 Jan",
    "volume": "5",
    "issue": "1",
    "pages": "38-52"
  },
  "8505175": {
    "title": "Dietary sugar intake in the aetiology of biliary tract cancer.",
    "author": "Moerman CJ",
    "source": "Int J Epidemiol",
    "pubdate": "1993 Apr",
    "volume": "22",
    "issue": "2",
    "pages": "207-14"
  },
  "8605001": {
    "title": "Glucose may induce cell death through a free radical-mediated mechanism.",
    "author": "Donnini D",
    "source": "Biochem Biophys Res Commun",
    "pubdate": "1996 Feb 15",
    "volume": "219",
    "issue": "2",
    "pages": "412-7"
  },
  "9187625": {
    "title": "Gestational age and infant size at birth are associated with dietary sugar intake among pregnant adolescents.",
    "author": "Lenders CM",
    "source": "J Nutr",
    "pubdate": "1997 Jun",
    "volume": "127",
    "issue": "6",
    "pages": "1113-7"
  },
  "9426688": {
    "title": "Sucrose as a risk factor for cancer of the colon and rectum: a case-control study in Uruguay.",
    "author": "De Stefani E",
    "source": "Int J Cancer",
    "pubdate": "1998 Jan 5",
    "volume": "75",
    "issue": "1",
    "pages": "40-4"
  },
  "9770725": {
    "title": "Dietary sugar and lung cancer: a case-control study in Uruguay.",
    "author": "De Stefani E",
    "source": "Nutr Cancer",
    "pubdate": "1998",
    "volume": "31",
    "issue": "2",
    "pages": "132-7"
  },
  "10049982": {
    "title": "High glycemic index foods, overeating, and obesity.",
    "author": "Ludwig DS",
    "source": "Pediatrics",
    "pubdate": "1999 Mar",
    "volume": "103",
    "issue": "3",
    "pages": "E26"
  },
  "10389747": {
    "title": "Risk factors for adenocarcinoma of the small intestine.",
    "author": "Negri E",
    "source": "Int J Cancer",
    "pubdate": "1999 Jul 19",
    "volume": "82",
    "issue": "2",
    "pages": "171-4"
  },
  "10584057": {
    "title": "Refined-cereal intake and risk of selected cancers in italy.",
    "author": "Chatenoud L",
    "source": "Am J Clin Nutr",
    "pubdate": "1999 Dec",
    "volume": "70",
    "issue": "6",
    "pages": "1107-10"
  },
  "10877198": {
    "title": "Effects of a high-fat-sucrose diet on enzymes in homocysteine metabolism in the rat.",
    "author": "Fonseca V",
    "source": "Metabolism",
    "pubdate": "2000 Jun",
    "volume": "49",
    "issue": "6",
    "pages": "736-41"
  },
  "10946914": {
    "title": "Glucose challenge stimulates reactive oxygen species (ROS) generation by leucocytes.",
    "author": "Mohanty P",
    "source": "J Clin Endocrinol Metab",
    "pubdate": "2000 Aug",
    "volume": "85",
    "issue": "8",
    "pages": "2970-3"
  },
  "12088740": {
    "title": "A high-fat, refined sugar diet reduces hippocampal brain-derived neurotrophic factor, neuronal plasticity, and learning.",
    "author": "Molteni R",
    "source": "Neuroscience",
    "pubdate": "2002",
    "volume": "112",
    "issue": "4",
    "pages": "803-14"
  },
  "12115553": {
    "title": "Food groups and laryngeal cancer risk: a case-control study from Italy and Switzerland.",
    "author": "Bosetti C",
    "source": "Int J Cancer",
    "pubdate": "2002 Jul 20",
    "volume": "100",
    "issue": "3",
    "pages": "355-60"
  },
  "12588090": {
    "title": "Increased risk of early-stage breast cancer related to consumption of sweet foods among women less than age 45 in the United States.",
    "author": "Potischman N",
    "source": "Cancer Causes Control",
    "pubdate": "2002 Dec",
    "volume": "13",
    "issue": "10",
    "pages": "937-46"
  },
  "12792139": {
    "title": "Dietary sugar and salt represent real risk factors for cataract development.",
    "author": "Veromann S",
    "source": "Ophthalmologica",
    "pubdate": "2003 Jul-Aug",
    "volume": "217",
    "issue": "4",
    "pages": "302-7"
  },
  "14594784": {
    "title": "Neural tube defects associated with maternal periconceptional dietary intake of simple sugars and glycemic index.",
    "author": "Shaw GM",
    "source": "Am J Clin Nutr",
    "pubdate": "2003 Nov",
    "volume": "78",
    "issue": "5",
    "pages": "972-8"
  },
  "15123503": {
    "title": "International variations in the outcome of schizophrenia and the prevalence of depression in relation to national dietary practices: an ecological analysis.",
    "author": "Peet M",
    "source": "Br J Psychiatry",
    "pubdate": "2004 May",
    "volume": "184",
    "issue": "",
    "pages": "404-8"
  },
  "15328324": {
    "title": "Sugar-sweetened beverages, weight gain, and incidence of type 2 diabetes in young and middle-aged women.",
    "author": "Schulze MB",
    "source": "JAMA",
    "pubdate": "2004 Aug 25",
    "volume": "292",
    "issue": "8",
    "pages": "927-34"
  },
  "15447888": {
    "title": "Comparison of dietary intakes associated with metabolic syndrome risk factors in young adults: the Bogalusa Heart Study.",
    "author": "Yoo S",
    "source": "Am J Clin Nutr",
    "pubdate": "2004 Oct",
    "volume": "80",
    "issue": "4",
    "pages": "841-8"
  },
  "15447918": {
    "title": "Fructose, glycemic load, and quantity and quality of carbohydrate in relation to plasma C-peptide concentrations in US women.",
    "author": "Wu T",
    "source": "Am J Clin Nutr",
    "pubdate": "2004 Oct",
    "volume": "80",
    "issue": "4",
    "pages": "1043-9"
  },
  "16087988": {
    "title": "Effect of sucrose on inflammatory markers in overweight humans.",
    "author": "SÃ¸rensen LB",
    "source": "Am J Clin Nutr",
    "pubdate": "2005 Aug",
    "volume": "82",
    "issue": "2",
    "pages": "421-7"
  },
  "17616779": {
    "title": "Association between dietary glycemic index and age-related macular degeneration in nondiabetic participants in the Age-Related Eye Disease Study.",
    "author": "Chiu CJ",
    "source": "Am J Clin Nutr",
    "pubdate": "2007 Jul",
    "volume": "86",
    "issue": "1",
    "pages": "180-8"
  },
  "19099241": {
    "title": "Evidence that a maternal \"junk food\" diet during pregnancy and lactation can reduce muscle force in offspring.",
    "author": "Bayol SA",
    "source": "Eur J Nutr",
    "pubdate": "2009 Feb",
    "volume": "48",
    "issue": "1",
    "pages": "62-5"
  },
  "19198870": {
    "title": "Role of fructose concentration on cataractogenesis in senile diabetic and non-diabetic patients.",
    "author": "Gul A",
    "source": "Graefes Arch Clin Exp Ophthalmol",
    "pubdate": "2009 Jun",
    "volume": "247",
    "issue": "6",
    "pages": "809-14"
  },
  "19381015": {
    "title": "Consuming fructose-sweetened, not glucose-sweetened, beverages increases visceral adiposity and lipids and decreases insulin sensitivity in overweight/obese humans.",
    "author": "Stanhope KL",
    "source": "J Clin Invest",
    "pubdate": "2009 May",
    "volume": "119",
    "issue": "5",
    "pages": "1322-34"
  },
  "19500683": {
    "title": "A high fructose diet impairs spatial memory in male rats.",
    "author": "Ross AP",
    "source": "Neurobiol Learn Mem",
    "pubdate": "2009 Oct",
    "volume": "92",
    "issue": "3",
    "pages": "410-6"
  },
  "19765850": {
    "title": "Soft drink consumption is associated with fatty liver disease independent of metabolic syndrome.",
    "author": "Abid A",
    "source": "J Hepatol",
    "pubdate": "2009 Nov",
    "volume": "51",
    "issue": "5",
    "pages": "918-24"
  },
  "20048020": {
    "title": "Association of Western and traditional diets with depression and anxiety in women.",
    "author": "Jacka FN",
    "source": "Am J Psychiatry",
    "pubdate": "2010 Mar",
    "volume": "167",
    "issue": "3",
    "pages": "305-11"
  },
  "20138901": {
    "title": "Sugar-sweetened beverages and risk of obesity and type 2 diabetes: epidemiologic evidence.",
    "author": "Hu FB",
    "source": "Physiol Behav",
    "pubdate": "2010 Apr 26",
    "volume": "100",
    "issue": "1",
    "pages": "47-54"
  },
  "20620757": {
    "title": "Nutrition and aging skin: sugar and glycation.",
    "author": "Danby FW",
    "source": "Clin Dermatol",
    "pubdate": "2010 Jul-Aug",
    "volume": "28",
    "issue": "4",
    "pages": "409-11"
  },
  "20702604": {
    "title": "Drinking caloric beverages increases the risk of adverse cardiometabolic outcomes in the Coronary Artery Risk Development in Young Adults (CARDIA) Study.",
    "author": "Duffey KJ",
    "source": "Am J Clin Nutr",
    "pubdate": "2010 Oct",
    "volume": "92",
    "issue": "4",
    "pages": "954-9"
  },
  "21800086": {
    "title": "Metabolic and behavioural effects of sucrose and fructose/glucose drinks in the rat.",
    "author": "Sheludiakova A",
    "source": "Eur J Nutr",
    "pubdate": "2012 Jun",
    "volume": "51",
    "issue": "4",
    "pages": "445-54"
  },
  "22205311": {
    "title": "Sucrose-sweetened beverages increase fat storage in the liver, muscle, and visceral fat depot: a 6-mo randomized intervention study.",
    "author": "Maersk M",
    "source": "Am J Clin Nutr",
    "pubdate": "2012 Feb",
    "volume": "95",
    "issue": "2",
    "pages": "283-9"
  },
  "22492378": {
    "title": "Soda consumption and the risk of stroke in men and women.",
    "author": "Bernstein AM",
    "source": "Am J Clin Nutr",
    "pubdate": "2012 May",
    "volume": "95",
    "issue": "5",
    "pages": "1190-9"
  },
  "22890489": {
    "title": "Effects on uric acid, body mass index and blood pressure in adolescents of consuming beverages sweetened with high-fructose corn syrup.",
    "author": "Lin WT",
    "source": "Int J Obes (Lond)",
    "pubdate": "2013 Apr",
    "volume": "37",
    "issue": "4",
    "pages": "532-9"
  },
  "26261186": {
    "title": "Diet and Dental Caries: The Pivotal Role of Free Sugars Reemphasized.",
    "author": "Sheiham A",
    "source": "J Dent Res",
    "pubdate": "2015 Oct",
    "volume": "94",
    "issue": "10",
    "pages": "1341-7"
  },
  "26474970": {
    "title": "Intake of high fructose corn syrup sweetened soft drinks is associated with prevalent chronic bronchitis in U.S. Adults, ages 20-55 y.",
    "author": "DeChristopher LR",
    "source": "Nutr J",
    "pubdate": "2015 Oct 16",
    "volume": "14",
    "issue": "",
    "pages": "107"
  },
  "NCJ 092810": {
    "title": "Los Angeles Probation Department Diet - Behavior Program - An Empirical Analysis of Six Institutional Settings",
    "author": "Schoenthaler SJ",
    "source": "International Journal of Biosocial Research",
    "pubdate": "1983",
    "volume": "5",
    "issue": "1",
    "pages": "88-98"
  },
  "S0005789488800273": {
    "title": "Prevalence, presenting symptoms, and psychological characteristics of individuals experiencing a diet-related mood-disturbance",
    "author": "Krietsch K",
    "source": "Behavior Therapy",
    "pubdate": "1987 Dec",
    "volume": "19",
    "issue": "4",
    "pages": "593â€“604"
  }
};
