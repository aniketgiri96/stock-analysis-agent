# Stock Analysis AI Agent

An AI-powered agent to analyze stocks, fetch market data, and assist with research workflows.

## Features

- Data ingestion from popular finance APIs
- Technical indicators and basic quantitative analytics
- Prompt-based research assistant for stocks
- Extensible architecture for adding new data sources or strategies

## Getting Started (Python)

1. Clone the repository:

```bash
git clone https://github.com/aniketgiri96/stock-analysis-agent.git
cd stock-analysis-agent
```

2. Create and activate a virtual environment:

```bash
# Windows (PowerShell)
python -m venv venv
venv\Scripts\Activate.ps1

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Configure keys and settings in `config.py`:

```python
# Alpha Vantage API key
ALPHA_VANTAGE_API_KEY = "your_api_key_here"

# Ollama local endpoint and model (optional LLM features)
OLLAMA_HOST = "http://127.0.0.1:11434"
OLLAMA_MODEL = "deepseek-r1:8b"
```

5. Run the app:

```bash
python app.py
```

6. Open your browser at:

```
http://127.0.0.1:5001
```

## Project Structure

```
Stock-Analysis-AI-Agent/
├─ agents/             # Data collection, analysis, visualization agents
├─ ui/                 # HTML templates, JS, CSS
├─ utils/              # Helper modules for data and APIs
├─ data/               # Cached API responses and artifacts
├─ app.py              # Flask app entrypoint
├─ config.py           # App configuration (API keys, ports)
├─ requirements.txt    # Python dependencies
└─ README.md           # Project documentation
```

## Useful commands

- **Create venv (Windows)**: `python -m venv venv && venv\Scripts\Activate.ps1`
- **Create venv (macOS/Linux)**: `python -m venv venv && source venv/bin/activate`
- **Install deps**: `pip install -r requirements.txt`
- **Run app**: `python app.py` (serves at `http://127.0.0.1:5001`)

## Contributing

Contributions are welcome! Please open an issue to discuss changes or submit a pull request.

## License

MIT License. See `LICENSE`.


## Overview

This application uses a pipeline of specialized agents to analyze stocks:

1. **Data Collector Agent**: Fetches historical stock data, news, and fundamentals from Alpha Vantage
2. **Analysis Agent**: Examines the data and generates insights and recommendations
3. **Visualization Agent**: Creates interactive charts and visual representations of the analysis

## Features

- Modern, responsive UI with sleek animations and visual feedback
- Real-time agent status visualization to show pipeline progress
- Interactive stock charts with price history and technical indicators
- Comprehensive analysis with buy/sell/hold recommendations
- Support for various time periods (1 week to 10 years)

## Requirements

- Python 3.10+
- Alpha Vantage API key (free tier is sufficient)
- Optional: Ollama running locally for LLM features (model configurable in `config.py`)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aniketgiri96/stock-analysis-agent.git
   cd stock-analysis-agent
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   ```bash
   # On Windows
   venv\Scripts\Activate.ps1

   # On macOS/Linux
   source venv/bin/activate
   ```

4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure your API keys in `config.py`:
   ```python
   # Alpha Vantage API key
   ALPHA_VANTAGE_API_KEY = "your_api_key_here"
   ```

## Running the Application

1. Ensure your virtual environment is activated:
   ```bash
   source venv/bin/activate
   ```

2. Start the Flask application:
   ```bash
   python app.py
   ```

3. Open your web browser and navigate to:
   ```
   http://127.0.0.1:5001
   ```

4. Enter a stock symbol (e.g., AAPL, MSFT, GOOG) and select a time period to analyze

5. To stop the application, press `Ctrl+C` in the terminal

6. When finished, deactivate the virtual environment:
   ```bash
   deactivate
   ```

## Architecture

### Agent Pipeline

The application uses a chain of agents, each with a specialized role:

1. **Data Collector Agent**: 
   - Fetches stock data from Alpha Vantage
   - Retrieves news articles and fundamental data
   - Caches responses to minimize API calls

2. **Analysis Agent**:
   - Processes historical price data
   - Analyzes trends and patterns
   - Generates buy/sell/hold recommendations with confidence levels

3. **Visualization Agent**:
   - Creates interactive price charts
   - Visualizes key technical indicators
   - Provides visual insights to support the analysis

### Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: Flask, Python
- **Data Visualization**: Plotly.js
- **API Integration**: Alpha Vantage, Yahoo Finance (fallback)
- **LLM Integration**: Ollama with deepseek-coder model

## Troubleshooting

- **Empty Charts**: If charts appear empty, check your Alpha Vantage API key in `config.py`
- **Slow Responses**: The free tier of Alpha Vantage has rate limits; cached responses are used when available
- **SSL/TLS Errors**: These are handled by the application and can be safely ignored

## License

MIT
