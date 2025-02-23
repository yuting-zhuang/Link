// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'error-as-aesthetic-noise-glitch-slitscan' // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.querySelector('#channel-title')
	let channelDescription = document.querySelector('#channel-description')
	let channelCount = document.querySelector('#channel-count')
	let channelLink = document.querySelector('#channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#channel-blocks')

	// Links!
	if (block.class == 'Link') {
		let linkItem =
			`
			<li>
				<div class="blue-link"></div>
					<img src="${ block.image.original.url }">	
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

	// Images!
	else if (block.class == 'Image') {
		let imageItem = 
			`
			<li class="Image">
				<div class="green-image"></div>
					<img src="${ block.image.original.url }">
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', imageItem);
		
		// …up to you!
	}

	// Text!
	else if (block.class == 'Text') {
		let textItem = 
			`
			<li class="text-block">
				<div class="red-text"></div>
					${ block.content }
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', textItem);
		// …up to you!
	}

	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				
			<li>
					<video controls src="${ block.attachment.url }"></video>
			</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			// …up to you!
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li class="audio">
					<div class="yellow-audio"></div>	
						<audio controls src="${ block.attachment.url }"></audio>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
				`
				<li class="video">
					<div class="black-video"></div>	
						${ block.embed.html }
				</li>
		
				`
			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		// Linked audio!
		else if (embed.includes('rich')) {

			`
				<li>
					${ block.embed.html }
				</li>
	
			`
			// …up to you!
		}
	}
}



// It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
	let userAddress =
		`
		<address>
			<img src="${ user.avatar_image.display }">
			<h3>${ user.first_name }</h3>
			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
		</address>
		`
	container.insertAdjacentHTML('beforeend', userAddress)
}



// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data

		console.log("fetch:",data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function
		
		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		let channelUsers = document.querySelector('#channel-users') // Show them together
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		renderUser(data.user, channelUsers);
		randomizePositions(); 
		startGlitch();
	})



	// function to shuffle the order of squares:
	function randomizePositions() {
		const items = document.querySelectorAll("#channel-blocks li");
	
		items.forEach(item => {
			// Generate a random offset of 0~180px directly within the grid
			const randomOffset = Math.random() * 180;
			item.style.transform = `translateX(${randomOffset}px)`;
		});
	}


	let glitchTimeout;

	function activateGlitch() {
		const overlay = document.getElementById('glitch-overlay');
		overlay.classList.add('active');

		// disapear in 1s
		setTimeout(() => {
			overlay.classList.remove('active');
		}, 1000);

		// click to stop the animation, refresh the page to get it back
		overlay.addEventListener('click', () => {
			overlay.classList.remove('active');
			clearTimeout(glitchTimeout);
		}, { once: true });
	}

	// Trigger every 10 seconds
	function startGlitch() {
		glitchTimeout = setInterval(activateGlitch, 20000);
	}

