let cl =console.log;

const showModal = document.getElementById("showModal");
const backdrop = document.getElementById("backdrop");
const movieModal = document.getElementById("movieModal");
const closeModal = [...document.querySelectorAll(".closeModal")];
const movieForm = document.getElementById("movieForm");
const titleControl = document.getElementById("title");
const imgUrlControl = document.getElementById("imgUrl");
const overviewControl = document.getElementById("overview");
const ratingControl = document.getElementById("rating");
const submitBtn= document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const movieContainer = document.getElementById("movieContainer");

let movieArr =[];

const modalBackDropToggle =()=>{
	backdrop.classList.toggle("active");
	movieModal.classList.toggle("active");
}

const onEdit =(e)=>{
	let editId = e.closest(".movieCard").id;
	localStorage.setItem("edit",editId);
	let editObj = movieArr.find(movie => movie.movieId === editId);
	cl(editObj);
	modalBackDropToggle();
	titleControl.value = editObj.title;
    imgUrlControl.value = editObj.imgUrl;
	overviewControl.value = editObj.overview;
	ratingControl.value = editObj.rating;
	submitBtn.classList.add("d-none");
	updateBtn.classList.remove("d-none");
}

const onDelete =(e)=>{
	    Swal.fire({
           title: "Do you want to Remove?",
           showDenyButton: true,
           //showCancelButton: true,
           confirmButtonText: "Yes",
          // denyButtonText: `Cancel`
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
			  let deleteId = e.closest(".movieCard").id;
	          let getIndex = movieArr.findIndex(movie => movie.movieId === deleteId);
	          movieArr.splice(getIndex,1);
	          localStorage.setItem("movieArr",JSON.stringify(movieArr));
	          e.closest(".col-md-4").remove();
             Swal.fire("Removed Successfully!", "", "success");
          } 
});
}

const generateUuid = () => {
    return (
        String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
    ).replace(/[xy]/g, (character) => {
        const random = (Math.random() * 16) | 0;
        const value = character === "x" ? random : (random & 0x3) | 0x8;

        return value.toString(16);
    });
};

const templatingMovie =(arr)=>{
	 let result = '';
	 arr.forEach(obj =>{
		 result +=`
		        <div class="col-md-4">
			      <div class="card mb-4">
				     <figure class="movieCard mb-0" id="${obj.movieId}">
					   <img src="${obj.imgUrl}" alt="${obj.title}" title="${obj.title}">
					 <figcaption>
					    <div class="rating-sec">
						   <div class="row">
						      <div class="col-md-10">
							     <h3 class="movieName mb-0">${obj.title}</h3>
							  </div>
							  <div class="col-md-2 align-self-center">
							  
							      ${obj.rating >=5 ? `<span class="bg-success">${obj.rating}</span>`:
								  obj.rating <=4 && obj.rating >=3 ?`<span class="bg-warning">${obj.rating}</span>`:
								  obj.rating <3 ? `<span class="bg-danger">${obj.rating}</span>`:
							     `<span class="bg-success">${obj.rating}</span>`}
								 
							  </div>
						   </div>
						</div>
						<div class="overview-sec">
						   <h4>${obj.title}</h4>
						   <em>Overview</em>
						   <p>${obj.overview}</p>
						   <div class="action">
						      <button class="btn btn-outline-success" onclick="onEdit(this)">Edit</button>
							  <button class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
						   </div>
						</div>
					 </figcaption>  
					 </figure> 
				  </div>
			  </div>
		 `
	 })
	  
	  movieContainer.innerHTML = result;
	
}

if(localStorage.getItem("movieArr")){
	movieArr = JSON.parse(localStorage.getItem("movieArr"));
	templatingMovie(movieArr);
}

const addMovie =(obj)=>{
	let card = document.createElement("div");
	card.className = "col-md-4";
	card.id = obj.movieId;
	card.innerHTML = `
	            <div class="card mb-4">
				     <figure class="movieCard mb-0" id="${obj.movieId}">
					   <img src="${obj.imgUrl}" alt="${obj.title}" title="${obj.title}">
					 <figcaption>
					    <div class="rating-sec">
						   <div class="row">
						      <div class="col-md-10">
							     <h3 class="movieName mb-0">${obj.title}</h3>
							  </div>
							  <div class="col-md-2 align-self-center">
							     <span class="bg-success">${obj.rating}</span>
							  </div>
						   </div>
						</div>
						<div class="overview-sec">
						   <h4>${obj.title}</h4>
						   <em>Overview</em>
						   <p>${obj.overview}</p>
						   <div class="action">
						      <button class="btn btn-outline-success" onclick="onEdit(this)">Edit</button>
							  <button class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
						   </div>
						   </div>
						</div>
					 </figcaption>  
					 </figure> 
				  </div>
			  </div>
	`
	movieContainer.prepend(card);
}

const OnMovieAdd =(e)=>{
	e.preventDefault();
	let newMovie ={
		title: titleControl.value,
		imgUrl: imgUrlControl.value,
		overview: overviewControl.value,
		rating: ratingControl.value,
		movieId: generateUuid()
	}
	movieArr.unshift(newMovie);
	localStorage.setItem("movieArr",JSON.stringify(movieArr));
	cl(movieArr);
	addMovie(newMovie);
	Swal.fire({
		title: `New Movie ${newMovie.title} is added is Added Successfully`,
		icon: "success",
		timer: 2500
	})
	modalBackDropToggle();
	e.target.reset();
}

showModal.addEventListener("click",modalBackDropToggle);
closeModal.forEach(btn =>{
	btn.addEventListener("click",modalBackDropToggle);
})

const OnUpdateMovie =()=>{
	let updateId = localStorage.getItem("edit");
	let updateObj ={
		title: titleControl.value,
		imgUrl: imgUrlControl.value,
		overview: overviewControl.value,
		rating: ratingControl.value,
		movieId: updateId
	}
	let getIndex = movieArr.findIndex(movie => movie.movieId === updateId);
	movieArr[getIndex] = updateObj;
	localStorage.setItem("movieArr",JSON.stringify(movieArr));
	let getCard = document.getElementById(updateId);
	getCard.innerHTML = `
	                      <img src="${updateObj.imgUrl}" alt="${updateObj.title}" title="${updateObj.title}">
					 <figcaption>
					    <div class="rating-sec">
						   <div class="row">
						      <div class="col-md-10">
							     <h3 class="movieName mb-0">${updateObj.title}</h3>
							  </div>
							  <div class="col-md-2 align-self-center">
							  
							     ${updateObj.rating >=5 ? `<span class="bg-success">${updateObj.rating}</span>`:
								  updateObj.rating <=4 && updateObj.rating >=3 ?`<span class="bg-warning">${updateObj.rating}</span>`:
								  updateObj.rating <3 ? `<span class="bg-danger">${updateObj.rating}</span>`:
							     `<span class="bg-success">${updateObj.rating}</span>`}
								 
							  </div>
						   </div>
						</div>
						<div class="overview-sec">
						   <h4>${updateObj.title}</h4>
						   <em>Overview</em>
						   <p>${updateObj.overview}</p>
						   <div class="action">
						      <button class="btn btn-outline-success" onclick="onEdit(this)">Edit</button>
							  <button class="btn btn-outline-danger" onclick="onDelete(this)">Delete</button>
						   </div>
						   </div>
						</div>
					 </figcaption>  
					 </figure> 
				  </div>
			  </div>
	          `
			 
			
	
	          movieForm.reset();
			  modalBackDropToggle();
			   Swal.fire({
		         title: `${updateObj.title} is Updated Successfully`,
		         icon: "success",
		         timer: 2500
			   })
			  submitBtn.classList.remove("d-none");
	          updateBtn.classList.add("d-none");
			 
			  
	cl(updateObj);
}

movieForm.addEventListener("submit",OnMovieAdd);
updateBtn.addEventListener("click",OnUpdateMovie);