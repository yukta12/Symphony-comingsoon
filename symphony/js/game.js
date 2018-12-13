var width = $(window).width();
			var height = $(window).height();
			var width_canvas = height/1.5;
			var tile_no = 0;
			var a = 0;
			var dead = 0;
			var b = width_canvas/4;
			var c = width_canvas/2;
			var d = width_canvas*3/4;
			var comming = 0;
			var rev_speed = 4;
			var score = 0;
			var time = height*rev_speed/3;
			$(".tile").css("width", b+'px');
			if(height > width)
			{
				$("#canvas").css("width", "100%");
			}
			else{
				$("#canvas").css("width", width_canvas+"px");
				$("#canvas").css("left", (width-width_canvas)/2+"px");
			}
			function add_tile()
			{
				tile_no++;
				$("#canvas").prepend($('<div id="tile'+ tile_no +'" class="tile" onclick="die('+tile_no+')"></div>'));
				set_tile(tile_no);
				
			}
			function set_tile(tile_no)
			{
				var r = Math.random();
				var g = Math.random();
				var bl = Math.random();
				var left;
				if(!comming)
				{
				if((r>0&&r<0.25))
				{
					left = a;
					comming = 1;
				}
				else if((r>=0.25&&r<0.5))
				{
					left = b;
					comming = 1;
				}
				else if((r>=0.5&&r<0.75))
				{
					left = c;
					comming = 1;
				}
				else if(r>=0.75)
				{
					left = d;
					comming = 1;
				}
				else{
					$("#tile"+tile_no).detach();
					return;
				}
				setTimeout(function(){
					comming = 0;
				},time);
				}
				$("#tile"+tile_no).css("left", left+"px").css("top", "-200px").css('background-color','#000');
				$(".tile").css("width", b+'px').css("height", height/3+"px");
				move_tile(tile_no, left);
				
			}
			function move_tile(tile_no, left){
				var top = -200;
				var Interval = setInterval(function(){
					top+=1;
					if(!dead && $("#tile"+tile_no).position())
					{
					if($("#tile"+tile_no).position().top < height-200)
					{
						$("#tile"+tile_no).css("top", top+"px");
					}
					else{
						dead = 1;
						$("#canvas").css("opacity", "0.4");
						$("#over").css("visibility", "visible");
						clearInterval(Interval);
					}
					}
				},rev_speed);
				
			}
			function write(data){
				$("#score").text(data);
			}
			function die(id){
				if(!dead)
				{
					$("#tile"+id).detach();
					score+=10;
					write("SCORE: "+score);
				}
			}
			$(document).ready(function(){
				
				var Interval = setInterval(function(){
					if(!dead)
					{
						add_tile();
					}
					else 
					{
						clearInterval(Interval);
					}
				},time);
				
			});