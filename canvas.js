const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

if (window.innerWidth > 1024) {
    var particleArray = null;
    let mouse = {
        x: -1,
        y: null
    }


    window.addEventListener("mousemove", function (event) {
		spawn();

    });

    window.onresize = function () { 
        if(window.innerWidth<=1024){
            location.reload();
        }
        else{
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        } 
    } //if  I dont do this resize ruins the particles

    window.addEventListener("mouseout", function (event) {
        context.clearRect(0, 0, innerWidth, innerHeight);
        mouse.x = -5;
        particleArray = null;

    });

	function spawn() {
		context.clearRect(0, 0, innerWidth, innerHeight);
		dx = event.x - mouse.x;
		dy = event.y - mouse.y;
		mouse.x = event.x;
		mouse.y = event.y;
		if (particleArray == null) {
			particleArray = [];
			for (i = 0; i < 30; i++) {
				particleArray[i] = new particle(i);
			}
		}
		else {
			for (i = 0; i < particleArray.length; i++) {
				particleArray[i].follow(dx, dy);
			}
		}
	}


    class particle {

        constructor(i) {
            this.id = i;
            this.x = mouse.x + plusMinus() * Math.random() * canvas.height / 10;
            this.y = mouse.y + plusMinus() * Math.random() * Math.sqrt(Math.pow(canvas.height / 10, 2) - Math.pow(this.x - mouse.x, 2));
            this.size = 3;
			this.xVelocity = plusMinus() * Math.random() * (canvas.height / 5000);
            this.yVelocity = plusMinus() * Math.random() * (canvas.height / 5000);
            context.beginPath();
            context.fillStyle = "white";
            context.strokeStyle = "white";
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            context.closePath();
            context.fill();
        }
        follow(x, y) {
            this.x += x;
            this.y += y;
            context.beginPath();
            context.fillStyle = "white";
            context.strokeStyle = "white";
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            context.closePath();
            context.fill();
        }
        draw() {
            context.beginPath();
            context.fillStyle = "white";
            context.strokeStyle = "white";
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            context.closePath();
            context.fill();
        }
        move() {
            if (canvas.height / 10 < Math.sqrt(Math.pow(this.x + this.xVelocity - mouse.x, 2) + Math.pow(this.y + this.yVelocity - mouse.y, 2))) {
                this.xVelocity *= -1;
                this.yVelocity *= -1;
            }
            this.x += this.xVelocity;
            this.y += this.yVelocity;
            this.draw();
        }
    }
    function drawLine(u, v) {
        context.beginPath();
        context.setLineDash([]);
        context.strokeStyle = "darkOrange";
        context.lineWidth = 15/dist(u, v);
        context.moveTo(u.x, u.y);
        context.lineTo(v.x, v.y);
        context.stroke();
    }
    
    function drawLineFormer(u, v) {
        context.beginPath();
        context.strokeStyle = "rgba(192,192,192,.5)";
        context.moveTo(u.x, u.y);
        context.lineTo(v.x, v.y);
        context.lineWidth = 10/dist(u, v);
        context.setLineDash([5]);
        context.stroke();
    }

    function animate() {
        requestAnimationFrame(animate);
        context.clearRect(0, 0, innerWidth, innerHeight);
        if (mouse.x < 0) {
            return;
        }
        else {
            for (i = 0; i < particleArray.length; i++) {
                particleArray[i].move();

            }
            djikstra();
        }
    }
    animate();
}
else{
    var particleArray = null;
    
    window.onresize = function () {
        if(window.innerWidth>1024){
            location.reload();
        }
        else{
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        spawn();
        }
    }

    function spawn() {
	    context.clearRect(0, 0, innerWidth, innerHeight);

		particleArray = [];
		for (i = 0; i < 50; i++) {
            particleArray[i] = new particle(i);
    }

	
}

    class particle {

        constructor(i) {
      
            this.id = i;
            this.x = Math.random() * canvas.width / 4 * plusMinus() + canvas.width / 2;

            this.y = canvas.height / 2 + plusMinus() *Math.random()* Math.sqrt(Math.pow(canvas.width / 4, 2) - Math.pow(this.x - canvas.width / 2, 2));
        
            this.size = 2;
            this.xVelocity = plusMinus() * Math.random() * (canvas.width / 1500);
            this.yVelocity = plusMinus() * Math.random() * (canvas.width / 1500);
            this.draw();
    }

        draw() {
            context.beginPath();
            context.fillStyle = "white";
            context.strokeStyle = "white";
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            context.closePath();
            context.fill();
        }
        move() {
            if (canvas.width/4<Math.sqrt(Math.pow(this.x + this.xVelocity - canvas.width / 2, 2) + Math.pow(this.y + this.yVelocity - canvas.height / 2, 2))) {
                this.xVelocity *= -1;
                this.yVelocity *= -1;
            }
                
         
        
            this.x += this.xVelocity;
            this.y += this.yVelocity;
            this.draw();
    }

    
}
function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, innerWidth, innerHeight);
        for (i = 0; i < particleArray.length; i++) {
            particleArray[i].move();
    } 
    djikstra();
   
    
}
spawn();
animate();
}

function djikstra() {
    var connected = [];
    var distance = [];
    var vertex = [];
    var previous = [];
    vertex = Array.from(particleArray);
    //set distance first point will be 0 it is the starting point, set others to area of screen essentially infinity by logic that it is higher than any possible distance between points
    distance[0] = 0;
    previous[0] = -1;
    for (i = 1; i < particleArray.length; i++) {
        distance[i] = canvas.width * canvas.height;
        previous[i] = -1;
    }
    while (vertex.length > 0) {
        var index = indexOfSmallest(vertex);
        connected.push(vertex.splice(index, 1)[0]);

        for (c = 0; c < connected.length; c++) {

            for (v = 0; v < vertex.length; v++) {
                if (distance[vertex[v].id] > dist(connected[c], vertex[v])) {
                    distance[vertex[v].id] = dist(connected[c], vertex[v]);
                    previous[vertex[v].id] = connected[c].id;
                    drawLineFormer(connected[c], vertex[v]);
                }
            }
        }

    }

    for (i = 1; i < particleArray.length; i++) {
        drawLine(particleArray[previous[i]], particleArray[i]);
    }
    //calculate the distance between two particles



    //return index of smallest value in array
    function indexOfSmallest(a) {
        var lowest = 0;
        for (var i = 1; i < a.length; i++) {
            if (distance[a[i].id] < distance[a[lowest].id]) {
                lowest = i;
            }
        }
        return lowest;
    }
}

function drawLine(u, v) {
    context.beginPath();
    context.setLineDash([]);
    context.strokeStyle = "rgba(255,140,0,.8)";
    context.lineWidth = 75/dist(u,v);
    context.moveTo(u.x, u.y);
    context.lineTo(v.x, v.y);
    context.stroke();
}

function drawLineFormer(u, v) {
    context.beginPath();
    context.strokeStyle = "rgba(255,255,255,.3)";
    context.moveTo(u.x, u.y);
    context.lineTo(v.x, v.y);
    context.lineWidth = 100/dist(u,v);
    context.setLineDash([5]);
    context.stroke();
}
function plusMinus() {
    let sign = Math.random() - .5;
    if (sign < 0) {
        sign = -1;
    }
    else {
        sign = 1;
    }
    return sign;
}



function dist(u, v) {
    result = Math.sqrt(Math.pow(u.x - v.x, 2) + Math.pow(u.y - v.y, 2));
    return result;
}