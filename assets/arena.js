let blocks = [];

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

let generateBlockContent = (block) => {
	let content = '';


	// Links!
	if (block.class == 'Link') {
		content =
			`
			<div class="modal-content-inner">
				<h3>${block.title || 'Link'}</h3>
					<img src="${ block.image.original.url }" style="max-width: 100%; height: auto;">
					${block.description_html || ''}
				<p><a href="${ block.source.url }">The Link ↗</a></p>
			</div>
			`
		// channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}


	// Images!
	else if (block.class == 'Image') {
		content = 
			`
			<div class="modal-content-inner">
				<h3>${block.title || 'Image'}</h3>
					<img src="${ block.image.original.url }">
					${block.description_html || ''}
			</div>
			`
		// channelBlocks.insertAdjacentHTML('beforeend', imageItem);
	}

	
	// Text!
	else if (block.class == 'Text') {
		content = 
			`
			<div class="modal-content-inner text-content">
				<h3>${block.title || 'Text'}</h3>
					${block.content_html || block.description_html || block.content ||''}
			</div>
			`
		// channelBlocks.insertAdjacentHTML('beforeend', textItem);
	}


	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			content =
				`
				<div class="modal-content-inner">
					<h3>${block.title || 'Video'}</h3>
						<video controls src="${ block.attachment.url }"></video>
						${block.content_html || ''}
				</div>
				`
			// channelBlocks.insertAdjacentHTML('beforeend', videoItem)
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
			content =
				`
				<div class="modal-content-inner">
					<h3>${block.title || 'Audio'}</h3>
						<audio controls src="${ block.attachment.url }" style="max-width:100%"></audio>
						${block.description_html || ''}
				</div>
				`;
			// channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			content =
				`
				<div class="modal-content-inner">
					<h3>${block.title || 'Video'}</h3>
						${ block.embed.html }
						${block.description_html || ''}
				</div>
				`;
			// channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
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
	return content;
};


// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#channel-blocks')

	let colorClass = '';
		let dataType = '';

		if (block.class == 'Link') {
			colorClass = 'blue-link';
			dataType = 'link';
		}

		else if (block.class == 'Image') {
			colorClass = 'green-image';
			dataType = 'image';
		}

		else if (block.class == 'Text') {
			colorClass = 'red-text';
			dataType = 'text';
		}

		else if (block.class == 'Attachment') {
			if (block.attachment.content_type.includes('video')) {
				colorClass = 'black-video';
				dataType = 'video';
				}
			else if (block.attachment.content_type.includes('audio')) {
				colorClass = 'yellow-audio';
				dataType = 'audio';
				}
		}

		else if (block.class == 'Media') {
			if (block.embed.type.includes('video')) {
				colorClass = 'black-video';
				dataType = 'embed-video';
				}
			else if (block.embed.type.includes('rich')) {
				colorClass = 'yellow-audio';
				dataType = 'embed-audio';
				}
		}

		//Only create a block when a valid color class is found.
		if (colorClass) {
			let blockItem = 
			`
				<li class="${block.class}-block" data-id="${block.id}">
					<div class="${colorClass}" data-content-type="${dataType}"></div>
				</li>
			`;
			channelBlocks.insertAdjacentHTML('beforeend', blockItem);
		}
		
		//Save block data for later use.
		blocks.push(block);
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


//Create modal overlay layer:
function createModalOverlay() {
	if (!document.getElementById('modal-overlay')) {
		const overlay = document.createElement('div');
		overlay.id = 'modal-overlay';
		overlay.className = 'modal-overlay';
		overlay.innerHTML = '<div id="modal-content"></div>';
		document.body.appendChild(overlay);
	}
}


//Show modal dialog:
function showModal(block) {
	const overlay = document.getElementById('modal-overlay');
	const contentContainer = document.getElementById('modal-content');
	
	// Generate content:
	contentContainer.innerHTML = generateBlockContent(block);
	
	// Show modal dialog:
	overlay.classList.add('active');
}

// Set up event handling for modal dialog:
function setupModalEvents() {
	const overlay = document.getElementById('modal-overlay');
	
	// clicks on all color block:
	document.addEventListener('click', function(e) {
		// Check if a color block was clicked:
		if (e.target.classList.contains('green-image') || 
			e.target.classList.contains('red-text') || 
			e.target.classList.contains('blue-link') || 
			e.target.classList.contains('black-video') || 
			e.target.classList.contains('yellow-audio')) {
			
			// Get block ID and find the corresponding block data:
			const blockLi = e.target.closest('li');
			const blockId = blockLi.dataset.id;
			const blockData = blocks.find(b => b.id.toString() === blockId);
			
			if (blockData) {
				showModal(blockData);
			}
		}
		
		// Close modal when clicking on the modal background:
		if (e.target === overlay) {
			overlay.classList.remove('active');
		}
	});
}

// function to shuffle the order of squares:
function randomizePositions() {
	const items = document.querySelectorAll("#channel-blocks li");

	items.forEach(item => {
		// Generate a random offset of 0~180px directly within the grid
		const randomOffset = Math.random() * 180;
		item.style.transform = `translateX(${randomOffset}px)`;
	});
}


// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data

		console.log("fetch:",data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

	blocks = [];
		
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

		// Create and set up modal dialog:
		createModalOverlay();
		setupModalEvents();
	})



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
		glitchTimeout = setInterval(activateGlitch, 2000000);
	}