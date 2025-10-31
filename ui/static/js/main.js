/**
 * Modern Stock Analysis UI - Enhanced JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // === THEME TOGGLE ===
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Add transition effect
        htmlElement.style.transition = 'background-color 0.3s, color 0.3s';
        setTimeout(() => {
            htmlElement.style.transition = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'bi bi-sun-fill';
        } else {
            icon.className = 'bi bi-moon-stars-fill';
        }
    }
    
    // === DOM ELEMENTS ===
    const stockForm = document.getElementById('stockForm');
    const stockSymbolInput = document.getElementById('stockSymbol');
    const timePeriodSelect = document.getElementById('timePeriod');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    const agent1Status = document.getElementById('agent1Status');
    const agent2Status = document.getElementById('agent2Status');
    const agent3Status = document.getElementById('agent3Status');
    
    const loadingChart = document.getElementById('loadingChart');
    const stockChart = document.getElementById('stockChart');
    const chartTitle = document.getElementById('chartTitle');
    
    const recommendationCard = document.getElementById('recommendationCard');
    const recommendationContent = document.getElementById('recommendationContent');
    
    const analysisCard = document.getElementById('analysisCard');
    const analysisContent = document.getElementById('analysisContent');
    
    const insightsCard = document.getElementById('insightsCard');
    const insightsContent = document.getElementById('insightsContent');
    
    // === FORM SUBMISSION ===
    stockForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const symbol = stockSymbolInput.value.trim().toUpperCase();
        const period = timePeriodSelect.value;
        
        if (!symbol) {
            showNotification('Please enter a stock symbol', 'warning');
            stockSymbolInput.focus();
            return;
        }
        
        // Reset UI
        resetUI();
        
        // Show loading state
        setButtonLoading(true);
        updateLoadingState(symbol);
        
        // Set the first agent to Processing immediately
        updateAgentStatus(agent1Status, 'Processing', 50);
        
        // Call API
        fetchStockAnalysis(symbol, period);
    });
    
    // === UI HELPERS ===
    function setButtonLoading(loading) {
        if (loading) {
            analyzeBtn.disabled = true;
            analyzeBtn.classList.add('loading');
            analyzeBtn.querySelector('.btn-content span').textContent = 'Analyzing...';
        } else {
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('loading');
            analyzeBtn.querySelector('.btn-content span').textContent = 'Analyze Stock';
        }
    }
    
    function updateLoadingState(symbol) {
        loadingChart.innerHTML = `
            <div class="loading-content">
                <div class="loading-icon">
                    <i class="bi bi-graph-up-arrow"></i>
                </div>
                <p class="loading-text">Analyzing ${symbol}...</p>
            </div>
        `;
        loadingChart.style.display = 'flex';
        stockChart.style.display = 'none';
    }
    
    function showNotification(message, type = 'info') {
        // Simple notification (can be enhanced with a toast library)
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 2rem;
            padding: 1rem 1.5rem;
            background: ${type === 'warning' ? '#f59e0b' : '#6366f1'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // === RESET UI ===
    function resetUI() {
        // Reset agent statuses
        updateAgentStatus(agent1Status, 'Idle', 0);
        updateAgentStatus(agent2Status, 'Idle', 0);
        updateAgentStatus(agent3Status, 'Idle', 0);
        
        // Hide results cards with animation
        hideCard(recommendationCard);
        hideCard(analysisCard);
        hideCard(insightsCard);
        
        // Reset chart
        stockChart.style.display = 'none';
        chartTitle.textContent = 'Stock Chart';
    }
    
    function hideCard(card) {
        if (card.style.display !== 'none') {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    }
    
    function showCard(card) {
        card.style.display = 'block';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        // Trigger reflow
        card.offsetHeight;
        
        requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    }
    
    // === UPDATE AGENT STATUS ===
    function updateAgentStatus(agentElement, status, progress) {
        const statusLabel = agentElement.querySelector('.status-label');
        const progressBar = agentElement.querySelector('.progress-bar-modern');
        const statusDot = agentElement.querySelector('.status-dot');
        
        if (!statusLabel || !progressBar) return;
        
        // Update status text
        statusLabel.textContent = status;
        
        // Update progress bar
        progressBar.style.width = progress + '%';
        
        // Update data attribute for styling
        agentElement.setAttribute('data-status', status.toLowerCase());
        
        // Add active class if processing or completed
        if (status === 'Processing' || status === 'Running') {
            agentElement.classList.add('active');
            // Activate connector if it exists
            const connector = agentElement.querySelector('.agent-connector');
            if (connector) {
                connector.classList.add('active');
            }
        } else if (status === 'Completed') {
            agentElement.classList.add('active');
        } else {
            agentElement.classList.remove('active');
            const connector = agentElement.querySelector('.agent-connector');
            if (connector) {
                connector.classList.remove('active');
            }
        }
        
        // Animate progress bar
        if (progress > 0) {
            progressBar.style.transition = 'width 0.5s ease';
        }
    }
    
    // === FETCH STOCK ANALYSIS ===
    function fetchStockAnalysis(symbol, period) {
        // Start a polling mechanism to show realistic agent states during processing
        const startPolling = new Date().getTime();
        const pollingInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const elapsedSeconds = (currentTime - startPolling) / 1000;
            
            // After 3 seconds, show Analysis Agent as processing if Data Collector still shows processing
            if (elapsedSeconds > 3 && 
                agent1Status.getAttribute('data-status') === 'processing' && 
                agent2Status.getAttribute('data-status') === 'idle') {
                updateAgentStatus(agent1Status, 'Completed', 100);
                updateAgentStatus(agent2Status, 'Processing', 50);
            }
            
            // After 6 seconds, show Visualization Agent as processing if Analysis Agent still shows processing
            if (elapsedSeconds > 6 && 
                agent2Status.getAttribute('data-status') === 'processing' && 
                agent3Status.getAttribute('data-status') === 'idle') {
                updateAgentStatus(agent2Status, 'Completed', 100);
                updateAgentStatus(agent3Status, 'Processing', 50);
            }
            
            // Stop polling after 20 seconds to avoid endless loop if the server doesn't respond
            if (elapsedSeconds > 20) {
                clearInterval(pollingInterval);
            }
        }, 1000);
        
        fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                symbol: symbol,
                period: period
            })
        })
        .then(response => {
            // Clear the polling interval once we get a response
            clearInterval(pollingInterval);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Enable button
            setButtonLoading(false);
            
            if (!data.success) {
                throw new Error(data.error || 'Unknown error occurred');
            }
            
            // Update pipeline status
            updatePipelineStatus(data.pipeline_status);
            
            // Display results
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            setButtonLoading(false);
            
            // Reset all agents to idle on error
            updateAgentStatus(agent1Status, 'Error', 0);
            updateAgentStatus(agent2Status, 'Idle', 0);
            updateAgentStatus(agent3Status, 'Idle', 0);
            
            loadingChart.innerHTML = `
                <div class="loading-content">
                    <div class="loading-icon" style="color: #ef4444;">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                    </div>
                    <p class="loading-text" style="color: #ef4444;">Error: ${error.message}</p>
                </div>
            `;
            
            showNotification(error.message || 'An error occurred while analyzing the stock', 'warning');
        });
    }
    
    // === UPDATE PIPELINE STATUS ===
    function updatePipelineStatus(pipelineStatus) {
        if (!pipelineStatus) return;
        
        // Update data collection status
        if (pipelineStatus.data_collection) {
            const status = pipelineStatus.data_collection.status;
            let displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
            let progress = 0;
            
            if (status === 'completed') {
                progress = 100;
                displayStatus = 'Completed';
            } else if (status === 'running') {
                displayStatus = 'Processing';
                progress = 50;
            }
            
            updateAgentStatus(agent1Status, displayStatus, progress);
        }
        
        // Update analysis status
        if (pipelineStatus.analysis) {
            const status = pipelineStatus.analysis.status;
            let displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
            let progress = 0;
            
            if (status === 'completed') {
                progress = 100;
                displayStatus = 'Completed';
            } else if (status === 'running') {
                displayStatus = 'Processing';
                progress = 50;
            }
            
            updateAgentStatus(agent2Status, displayStatus, progress);
        }
        
        // Update visualization status
        if (pipelineStatus.visualization) {
            const status = pipelineStatus.visualization.status;
            let displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
            let progress = 0;
            
            if (status === 'completed') {
                progress = 100;
                displayStatus = 'Completed';
            } else if (status === 'running') {
                displayStatus = 'Processing';
                progress = 50;
            }
            
            updateAgentStatus(agent3Status, displayStatus, progress);
        }
    }
    
    // === DISPLAY RESULTS ===
    function displayResults(data) {
        // Update chart title
        chartTitle.textContent = `${data.symbol} - ${data.period_description || 'Stock Chart'}`;
        
        // Show recommendation with animation
        showCard(recommendationCard);
        recommendationContent.innerHTML = createRecommendationHTML(data.recommendation, data.confidence);
        
        // Show analysis if available
        if (data.analysis) {
            showCard(analysisCard);
            analysisContent.innerHTML = formatAnalysisText(data.analysis);
        }
        
        // Show visualization insights if available
        if (data.visualization_insights) {
            showCard(insightsCard);
            insightsContent.innerHTML = '<p>' + data.visualization_insights + '</p>';
        }
        
        // Create chart
        createStockChart(data.chart_config);
    }
    
    // === CREATE RECOMMENDATION HTML ===
    function createRecommendationHTML(recommendation, confidence) {
        let recommendationClass = '';
        if (recommendation === 'BUY') {
            recommendationClass = 'buy-recommendation';
        } else if (recommendation === 'SELL') {
            recommendationClass = 'sell-recommendation';
        } else {
            recommendationClass = 'hold-recommendation';
        }
        
        let confidenceClass = '';
        if (confidence === 'HIGH') {
            confidenceClass = 'confidence-high';
        } else if (confidence === 'MEDIUM') {
            confidenceClass = 'confidence-medium';
        } else {
            confidenceClass = 'confidence-low';
        }
        
        return `
            <div class="text-center mb-3">
                <h2 class="${recommendationClass}">${recommendation}</h2>
                <p class="${confidenceClass}">Confidence: ${confidence}</p>
            </div>
        `;
    }
    
    // === FORMAT ANALYSIS TEXT ===
    function formatAnalysisText(analysisText) {
        // Split the text by newlines and wrap in <p> tags
        const paragraphs = analysisText.split('\n\n');
        return paragraphs.map(p => {
            // Skip empty paragraphs
            if (!p.trim()) return '';
            
            // Check if this is a heading (starts with numbers followed by period)
            if (/^\d+\.\s+/.test(p)) {
                return '<h6>' + p + '</h6>';
            }
            
            // Normal paragraph
            return '<p>' + p + '</p>';
        }).join('');
    }
    
    // === CREATE STOCK CHART ===
    function createStockChart(chartConfig) {
        if (!chartConfig || !chartConfig.data) {
            loadingChart.innerHTML = `
                <div class="loading-content">
                    <div class="loading-icon" style="color: #f59e0b;">
                        <i class="bi bi-exclamation-circle-fill"></i>
                    </div>
                    <p class="loading-text" style="color: #f59e0b;">No chart data available</p>
                </div>
            `;
            return;
        }
        
        // Hide loading, show chart with animation
        loadingChart.style.display = 'none';
        stockChart.style.display = 'block';
        stockChart.style.opacity = '0';
        
        requestAnimationFrame(() => {
            stockChart.style.transition = 'opacity 0.3s ease';
            stockChart.style.opacity = '1';
        });
        
        const dates = chartConfig.data.dates;
        const prices = chartConfig.data.prices;
        const volumes = chartConfig.data.volumes;
        
        // Get theme colors
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#f1f5f9' : '#1a1a1a';
        const gridColor = isDark ? '#3a3a3a' : '#e2e8f0';
        const bgColor = isDark ? '#2d2d2d' : '#ffffff';
        
        // Price trace
        const priceTrace = {
            x: dates,
            y: prices,
            type: 'scatter',
            mode: 'lines',
            name: 'Price',
            line: { color: '#3182ce', width: 2, shape: 'linear' },
            hovertemplate: '%{y:.2f}<extra>Price</extra>'
        };
        
        const traces = [priceTrace];
        
        if (chartConfig.data.has_ma20) {
            traces.push({
                x: dates,
                y: chartConfig.data.ma20,
                type: 'scatter',
                mode: 'lines',
                name: 'MA 20',
                line: { color: '#4a5568', width: 1.5, dash: 'dot' },
                hovertemplate: '%{y:.2f}<extra>MA 20</extra>'
            });
        }
        if (chartConfig.data.has_ma50) {
            traces.push({
                x: dates,
                y: chartConfig.data.ma50,
                type: 'scatter',
                mode: 'lines',
                name: 'MA 50',
                line: { color: '#d69e2e', width: 1.5, dash: 'dot' },
                hovertemplate: '%{y:.2f}<extra>MA 50</extra>'
            });
        }
        
        // Volume
        traces.push({
            x: dates,
            y: volumes,
            type: 'bar',
            name: 'Volume',
            marker: { color: isDark ? '#808080' : '#cbd5e1', opacity: 0.6 },
            yaxis: 'y2',
            hovertemplate: '%{y:,}<extra>Volume</extra>'
        });
        
        // Layout
        const layout = {
            autosize: true,
            paper_bgcolor: bgColor,
            plot_bgcolor: bgColor,
            font: { family: 'Inter, sans-serif', color: textColor, size: 12 },
            margin: { l: 48, r: 32, b: 48, t: 24, pad: 4 },
            xaxis: {
                title: { text: 'Date', font: { size: 12, color: textColor } },
                gridcolor: gridColor,
                linecolor: gridColor,
                rangeslider: { visible: true, thickness: 0.06, bgcolor: isDark ? '#3a3a3a' : '#f5f7fa' }
            },
            yaxis: {
                title: { text: 'Price', font: { size: 12, color: textColor } },
                gridcolor: gridColor,
                linecolor: gridColor,
                zeroline: false
            },
            yaxis2: {
                title: { text: 'Volume', font: { size: 12, color: textColor } },
                overlaying: 'y',
                side: 'right',
                gridcolor: 'transparent',
                rangemode: 'nonnegative'
            },
            legend: { orientation: 'h', y: 1.02, x: 0.5, xanchor: 'center' },
            hovermode: 'x unified',
            hoverlabel: { bgcolor: bgColor, bordercolor: gridColor, font: { color: textColor } }
        };
        
        // Recommendation annotation
        if (dates && dates.length && prices && prices.length && chartConfig.recommendation) {
            const recommendationColor = chartConfig.recommendation === 'BUY' ? '#38a169' : (chartConfig.recommendation === 'SELL' ? '#e53e3e' : '#d69e2e');
            layout.annotations = [{
                x: dates[dates.length - 1],
                y: prices[prices.length - 1],
                xref: 'x', yref: 'y', text: chartConfig.recommendation,
                showarrow: true, arrowhead: 2, arrowsize: 1, arrowwidth: 1.5,
                arrowcolor: recommendationColor,
                font: { color: recommendationColor, size: 12 },
                bgcolor: bgColor, bordercolor: recommendationColor, borderwidth: 1, borderpad: 3, opacity: 0.9
            }];
        }
        
        // Render or update chart
        if (stockChart.data && stockChart.data.length) {
            Plotly.react(stockChart, traces, layout, { responsive: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d','lasso2d'] });
        } else {
            Plotly.newPlot(stockChart, traces, layout, { responsive: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d','lasso2d'] });
        }
        
        // Debounced resize
        let resizeTimer;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => Plotly.Plots.resize(stockChart), 100);
        };
        window.addEventListener('resize', onResize);
        
        // Theme change: relayout only
        const observer = new MutationObserver(() => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const darkNow = currentTheme === 'dark';
            const newText = darkNow ? '#f5f5f5' : '#1a1a1a';
            const newGrid = darkNow ? '#3a3a3a' : '#e2e8f0';
            const newBg = darkNow ? '#2d2d2d' : '#ffffff';
            Plotly.relayout(stockChart, {
                paper_bgcolor: newBg,
                plot_bgcolor: newBg,
                'xaxis.gridcolor': newGrid,
                'xaxis.linecolor': newGrid,
                'yaxis.gridcolor': newGrid,
                'yaxis.linecolor': newGrid,
                'yaxis2.linecolor': newGrid,
                font: { family: 'Inter, sans-serif', color: newText, size: 12 },
                hoverlabel: { bgcolor: newBg, bordercolor: newGrid }
            });
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }
    
    // === CSS ANIMATIONS ===
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
