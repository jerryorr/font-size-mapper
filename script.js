/**
 * Stores the text to compare and manages text updates
 */
let compareText = 'Hello World 100';

/**
 * Font sizes to compare
 */
const fontSizesToCompare = [6, 7, 8, 9, 10, 11, 13, 14, 15, 16, 18, 20, 24, 26, 29, 32, 34, 37, 48, 72];

/**
 * Updates all text elements with the current comparison text
 */
function updateAllText() {
	const textElements = document.querySelectorAll('.text');
	textElements.forEach(el => {
		el.textContent = compareText;
	});
}

/**
 * Adjusts the font size of the Inter Variable text to be equal or smaller
 * than the Source Sans Pro text in both width and height dimensions.
 */
function adjustFontSize() {
	// Update all text elements first
	updateAllText();
	
	// Process width comparison
	adjustSingleComparison(
		'sourceSansText', 
		'interText', 
		'Width comparison'
	);
	
	// Process height comparison
	adjustSingleComparison(
		'sourceSansTextSide', 
		'interTextSide', 
		'Height comparison',
		true
	);
}

/**
 * Adjusts a single comparison between Source Sans Pro and Inter Variable
 * @param {string} sourceId - ID of the Source Sans Pro element
 * @param {string} interId - ID of the Inter Variable element
 * @param {string} label - Label for the comparison in metrics
 * @param {boolean} append - Whether to append to metrics (true) or replace (false)
 * @param {number} sourceFontSize - Optional source font size (defaults to 24px)
 * @returns {Object} An object containing the original and adjusted font sizes
 */
function adjustSingleComparison(sourceId, interId, label, append = false, sourceFontSize = 24) {
	// Get reference to elements
	const sourceSansText = document.getElementById(sourceId);
	const interText = document.getElementById(interId);
	const metricsDiv = document.getElementById('metrics');
	
	// Set Source Sans Pro font size
	sourceSansText.style.fontSize = `${sourceFontSize}px`;
	
	// Get the initial dimensions of the Source Sans Pro text
	const sourceSansRect = sourceSansText.getBoundingClientRect();
	const targetWidth = sourceSansRect.width;
	const targetHeight = sourceSansRect.height;
	
	// Debug info
	console.log(`${label} - Source Sans Pro dimensions:`, targetWidth, targetHeight);
	
	// Set initial font size for Inter Variable text
	let fontSize = sourceFontSize; // Start with the same font size
	interText.style.fontSize = `${fontSize}px`;
	
	// Force layout recalculation
	void interText.offsetWidth;
	
	// Get initial dimensions of Inter Variable text
	let interRect = interText.getBoundingClientRect();
	let currentWidth = interRect.width;
	let currentHeight = interRect.height;
	
	// Debug info
	console.log(`${label} - Initial Inter dimensions:`, currentWidth, currentHeight);
	
	// Track the adjustment steps
	let adjustmentSteps = [];
	adjustmentSteps.push(`<strong>${label}:</strong>`);
	adjustmentSteps.push(`Source Sans Pro (${sourceFontSize}px): ${Math.round(targetWidth)}px × ${Math.round(targetHeight)}px`);
	adjustmentSteps.push(`Inter Variable (initial ${fontSize}px): ${Math.round(currentWidth)}px × ${Math.round(currentHeight)}px`);
	
	// Reduce font size until dimensions are equal to or less than Source Sans Pro
	while ((currentWidth > targetWidth || currentHeight > targetHeight) && 
		   fontSize > 1) {
		// Reduce font size
		fontSize -= 1;
		interText.style.fontSize = `${fontSize}px`;
		
		// Force layout recalculation
		void interText.offsetWidth;
		
		// Measure again
		interRect = interText.getBoundingClientRect();
		currentWidth = interRect.width;
		currentHeight = interRect.height;
		
		console.log(`${label} - Inter at ${fontSize}px:`, currentWidth, currentHeight);
		
		// Log the adjustment
		adjustmentSteps.push(`Inter Variable (${fontSize}px): ${Math.round(currentWidth)}px × ${Math.round(currentHeight)}px`);
	}
	
	// Display final measurements
	const html = adjustmentSteps.join('<br>');
	if (append) {
		metricsDiv.innerHTML += '<br><br>' + html;
	} else {
		metricsDiv.innerHTML = html;
	}
	
	// Return the results
	return {
		sourceSize: sourceFontSize,
		adjustedSize: fontSize
	};
}

/**
 * Run comparisons for all the specified font sizes
 */
function runMultiSizeComparison() {
	const metricsDiv = document.getElementById('metrics');
	const results = [];
	
	// Clear previous results and remove any existing comparison containers
	metricsDiv.innerHTML = '<h3>Font Size Comparisons</h3>';
	
	// Remove existing comparison containers if any
	const existingComparisons = document.querySelector('.all-comparisons');
	if (existingComparisons) {
		existingComparisons.remove();
	}
	
	const existingSummary = document.querySelector('.summary');
	if (existingSummary) {
		existingSummary.remove();
	}
	
	const existingChart = document.querySelector('.chart-container');
	if (existingChart) {
		existingChart.remove();
	}
	
	const existingKotlinMap = document.querySelector('.kotlin-map-container');
	if (existingKotlinMap) {
		existingKotlinMap.remove();
	}
	
	// Create a container for all the comparisons
	const comparisonsContainer = document.createElement('div');
	comparisonsContainer.className = 'all-comparisons';
	
	// Insert the container in the correct place
	// First, find a good insertion point
	const metricsContainer = document.querySelector('.metrics');
	if (metricsContainer && metricsContainer.parentNode) {
		metricsContainer.parentNode.insertBefore(comparisonsContainer, metricsContainer);
	} else {
		// Fallback - just append to body
		document.body.appendChild(comparisonsContainer);
	}
	
	// Process each font size
	fontSizesToCompare.forEach((size, index) => {
		// Create a container for this comparison
		const comparisonContainer = document.createElement('div');
		comparisonContainer.className = 'font-comparison';
		comparisonContainer.innerHTML = `<h4>${size}px Source Sans Pro</h4>`;
		comparisonsContainer.appendChild(comparisonContainer);
		
		// Create comparison elements
		const verticalContainer = document.createElement('div');
		verticalContainer.className = 'container vertical';
		
		const horizontalContainer = document.createElement('div');
		horizontalContainer.className = 'container horizontal';
		
		// Create Source Sans Pro elements
		const sourceSansVertical = document.createElement('div');
		sourceSansVertical.className = 'text source-sans';
		sourceSansVertical.id = `sourceSans_${size}_v`;
		sourceSansVertical.textContent = compareText;
		sourceSansVertical.style.fontSize = `${size}px`;
		
		const sourceSansHorizontal = document.createElement('div');
		sourceSansHorizontal.className = 'text source-sans';
		sourceSansHorizontal.id = `sourceSans_${size}_h`;
		sourceSansHorizontal.textContent = compareText;
		sourceSansHorizontal.style.fontSize = `${size}px`;
		
		// Create Inter Variable elements
		const interVertical = document.createElement('div');
		interVertical.className = 'text inter-variable';
		interVertical.id = `inter_${size}_v`;
		interVertical.textContent = compareText;
		
		const interHorizontal = document.createElement('div');
		interHorizontal.className = 'text inter-variable';
		interHorizontal.id = `inter_${size}_h`;
		interHorizontal.textContent = compareText;
		
		// Add elements to containers
		verticalContainer.appendChild(sourceSansVertical);
		verticalContainer.appendChild(interVertical);
		
		horizontalContainer.appendChild(sourceSansHorizontal);
		horizontalContainer.appendChild(interHorizontal);
		
		// Add containers to the comparison div
		comparisonContainer.appendChild(document.createElement('p')).textContent = 'Width comparison:';
		comparisonContainer.appendChild(verticalContainer);
		
		comparisonContainer.appendChild(document.createElement('p')).textContent = 'Height comparison:';
		comparisonContainer.appendChild(horizontalContainer);
		
		// Run the comparison
		const resultV = adjustSingleComparison(
			`sourceSans_${size}_v`,
			`inter_${size}_v`,
			`Size ${size}px width`,
			true,
			size
		);
		
		const resultH = adjustSingleComparison(
			`sourceSans_${size}_h`,
			`inter_${size}_h`,
			`Size ${size}px height`,
			true,
			size
		);
		
		// Add result info to the comparison
		const resultInfo = document.createElement('div');
		resultInfo.className = 'comparison-result';
		resultInfo.innerHTML = `
			<p><strong>Source Sans Pro: ${size}px</strong></p>
			<p>Inter Variable needed: ${resultV.adjustedSize}px (${(resultV.adjustedSize / resultV.sourceSize * 100).toFixed(1)}%)</p>
		`;
		comparisonContainer.appendChild(resultInfo);
		
		// Store result for summary table
		results.push({
			sourceSize: resultV.sourceSize,
			adjustedSize: resultV.adjustedSize,
			ratio: (resultV.adjustedSize / resultV.sourceSize * 100).toFixed(1)
		});
		
		// Add a separator
		if (index < fontSizesToCompare.length - 1) {
			const separator = document.createElement('hr');
			comparisonContainer.appendChild(separator);
		}
	});
	
	// Generate summary table
	let summaryHtml = `
		<h3>Summary Table</h3>
		<table class="results-table">
			<thead>
				<tr>
					<th>Source Sans Pro Size</th>
					<th>Inter Variable Size</th>
					<th>Ratio</th>
				</tr>
			</thead>
			<tbody>
	`;
	
	// Add all results to the table
	results.forEach(result => {
		summaryHtml += `
			<tr>
				<td>${result.sourceSize}px</td>
				<td>${result.adjustedSize}px</td>
				<td>${result.ratio}%</td>
			</tr>
		`;
	});
	
	// Close table
	summaryHtml += '</tbody></table>';
	
	// Add the table to the page
	const summaryDiv = document.createElement('div');
	summaryDiv.className = 'summary';
	summaryDiv.innerHTML = summaryHtml;
	
	// Insert in the correct place
	const allComparisons = document.querySelector('.all-comparisons');
	if (allComparisons && allComparisons.parentNode) {
		allComparisons.parentNode.insertBefore(summaryDiv, allComparisons);
	} else {
		document.body.appendChild(summaryDiv);
	}
	
	// Generate Kotlin map
	let kotlinMapHtml = `
		<h3>Kotlin Map Definition</h3>
		<pre><code class="language-kotlin">val sourceSansProToInterMap = mapOf(
${results.map(result => `    ${result.sourceSize} to ${result.adjustedSize}`).join(',\n')}
)</code></pre>
	`;
	
	// Add the Kotlin map to the page
	const kotlinMapDiv = document.createElement('div');
	kotlinMapDiv.className = 'kotlin-map-container';
	kotlinMapDiv.innerHTML = kotlinMapHtml;
	
	// Insert in the correct place
	if (summaryDiv && summaryDiv.parentNode) {
		summaryDiv.parentNode.insertBefore(kotlinMapDiv, summaryDiv.nextSibling);
	} else if (allComparisons && allComparisons.parentNode) {
		allComparisons.parentNode.insertBefore(kotlinMapDiv, allComparisons);
	} else {
		document.body.appendChild(kotlinMapDiv);
	}
	
	// Remove existing back-to-top button if any
	const existingBackToTop = document.querySelector('.back-to-top');
	if (existingBackToTop) {
		existingBackToTop.remove();
	}
	
	// Create a "Back to Top" button
	const backToTopButton = document.createElement('a');
	backToTopButton.className = 'back-to-top';
	backToTopButton.href = '#';
	backToTopButton.innerHTML = '↑';
	backToTopButton.addEventListener('click', (e) => {
		e.preventDefault();
		window.scrollTo({top: 0, behavior: 'smooth'});
	});
	document.body.appendChild(backToTopButton);
}

/**
 * Set up event listeners and initial state
 */
function initialize() {
	// Set up the text update button
	const updateButton = document.getElementById('updateText');
	const textInput = document.getElementById('textInput');
	
	// Add a button for multi-size comparison
	const controlsDiv = document.querySelector('.controls');
	const multiSizeButton = document.createElement('button');
	multiSizeButton.textContent = 'Run Multi-size Comparison';
	multiSizeButton.id = 'multiSizeButton';
	multiSizeButton.style.marginLeft = '10px';
	controlsDiv.appendChild(multiSizeButton);
	
	// Set up event listeners
	updateButton.addEventListener('click', () => {
		compareText = textInput.value.trim() || 'Hello World 100';
		adjustFontSize();
	});
	
	multiSizeButton.addEventListener('click', runMultiSizeComparison);
	
	// Initial font adjustment
	adjustFontSize();
}

// Ensure fonts are loaded before measuring
document.fonts.ready.then(() => {
	// Wait a bit more to be sure fonts are applied
	setTimeout(initialize, 100);
}); 