"""
Data Collector Agent - Responsible for collecting stock data from the internet
"""

import os
import json
from typing import Dict, Any, List
import yfinance as yf
from datetime import datetime

from agents.base_agent import BaseAgent
from utils.stock_utils import fetch_stock_data, fetch_news, get_stock_fundamentals
from config import TIME_PERIODS

class DataCollectorAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="DataCollectorAgent")
        self.system_prompt = """
        You are a senior financial data acquisition specialist.
        Your job is to reliably gather complete, clean, and well-structured stock data
        suitable for downstream analysis and visualization.
        
        Collection principles:
        - Prioritize data completeness and correctness
        - Capture provenance/source and timestamps
        - Normalize fields and ensure consistent schemas
        - Surface gaps or anomalies explicitly
        - Keep responses concise and structured
        """
    
    def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process the input data and collect stock information.
        
        Args:
            input_data: Dictionary containing 'symbol' and 'period'
            
        Returns:
            Dictionary with collected stock data
        """
        self.update_status("processing")
        
        try:
            # Extract input parameters
            symbol = input_data.get('symbol', '')
            period = input_data.get('period', '1y')
            
            if not symbol:
                raise ValueError("Stock symbol is required")
            
            if period not in TIME_PERIODS:
                period = '1y'  # Default to 1 year if invalid period
            
            # Collect historical data
            self.update_status(f"collecting historical data for {symbol} ({TIME_PERIODS[period]})")
            historical_data = fetch_stock_data(symbol, period)
            
            if not historical_data['success']:
                self.error = historical_data['error']
                self.update_status("error")
                return {"success": False, "error": self.error}
            
            # Collect news
            self.update_status(f"collecting news for {symbol}")
            news = fetch_news(symbol)
            
            # Collect fundamentals
            self.update_status(f"collecting fundamentals for {symbol}")
            fundamentals = get_stock_fundamentals(symbol)
            
            # Use Ollama to add insights about the data collection process
            prompt = f"""
            # Data Collection Summary for {symbol}
            
            Period: {TIME_PERIODS[period]}
            Historical points: {len(historical_data['data'])}
            News articles: {len(news)}
            Fundamentals: balance sheet, income statement, cash flow
            Source: {historical_data.get('source', 'unknown')}
            
            Provide a concise assessment including:
            - Coverage completeness and any notable gaps
            - Data quality or anomalies worth flagging
            - Suitability for technical and fundamental analysis
            - Any recommended next data to collect (if gaps exist)
            
            Keep under 120 words.
            """
            
            data_insights = self._call_ollama(prompt, self.system_prompt)
            
            # Prepare output
            result = {
                "success": True,
                "symbol": symbol,
                "period": period,
                "period_description": TIME_PERIODS[period],
                "historical_data": {
                    "success": historical_data['success'],
                    "data": historical_data['data'],
                    "info": historical_data['info'],
                    "source": historical_data.get('source', 'unknown')
                },
                "news": news,
                "fundamentals": fundamentals,
                "data_insights": data_insights,
                "timestamp": datetime.now().isoformat(),
                # Add these fields for the other agents
                "chart_data": historical_data['data'],
                "company_info": historical_data['info']
            }
            
            # Debug: Verify data structure
            print("\n" + "="*50)
            print("DATA COLLECTOR AGENT - DEBUG INFO")
            print("="*50)
            print(f"Symbol: {symbol}, Period: {period}")
            print(f"Historical data length: {len(historical_data['data'])}")
            print(f"Chart data length: {len(historical_data['data'])}")
            print(f"First data point: {json.dumps(historical_data['data'][0], indent=2) if historical_data['data'] else 'None'}")
            print(f"Result keys: {list(result.keys())}")
            print("="*50)
            
            self.result = result
            self.update_status("completed")
            return result
            
        except Exception as e:
            self.error = str(e)
            self.update_status("error")
            return {"success": False, "error": self.error}
