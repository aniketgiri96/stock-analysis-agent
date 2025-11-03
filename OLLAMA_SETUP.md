# How to Run Ollama for Stock Analysis AI Agent

## Step 1: Install Ollama

### Windows:
1. Download Ollama from: https://ollama.ai/download
2. Run the installer
3. Ollama will automatically start as a service

### macOS/Linux:
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

## Step 2: Download the Required Model

Your project is configured to use `deepseek-r1:8b`. Pull it using:

```bash
ollama pull deepseek-r1:8b
```

**Note:** If you don't have this model, you can use a different one by updating `config.py`:
- `llama3.2:3b` (smaller, faster)
- `llama3.1:8b` (balanced)
- `deepseek-coder:1.5b` (smaller coding model)

## Step 3: Start Ollama Service

### Windows:
Ollama usually runs automatically as a service after installation. If not:
1. Open Command Prompt or PowerShell
2. Run: `ollama serve`
3. Keep this window open (or run it in the background)

### macOS/Linux:
```bash
ollama serve
```

Or if you want it to run in the background:
```bash
ollama serve &
```

## Step 4: Verify Ollama is Running

Open a new terminal and test:

```bash
ollama list
```

You should see your installed models. You can also test it directly:

```bash
ollama run deepseek-r1:8b "Hello, are you working?"
```

## Step 5: Verify Connection

Check if Ollama API is accessible:

```bash
# Windows PowerShell
curl http://127.0.0.1:11434/api/tags

# macOS/Linux
curl http://127.0.0.1:11434/api/tags
```

You should see a JSON response with your models.

## Running Your Stock Analysis App

Once Ollama is running:

1. Activate your virtual environment:
   ```bash
   venv\Scripts\Activate.ps1  # Windows PowerShell
   ```

2. Start your Flask app:
   ```bash
   python app.py
   ```

3. Open your browser: http://127.0.0.1:5001

## Troubleshooting

### Ollama not connecting?
- Make sure Ollama is running: `ollama serve`
- Check the port: Default is `11434` (matches your config)
- Verify in `config.py` that `OLLAMA_HOST = "http://127.0.0.1:11434"`

### Model not found?
- Pull the model: `ollama pull deepseek-r1:8b`
- Or change the model in `config.py` to one you have installed
- Check available models: `ollama list`

### Port already in use?
- Check if another Ollama instance is running
- Change the port in Ollama or update `config.py` accordingly


