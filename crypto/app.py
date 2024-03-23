from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
  # Data for template (replace with actual data structures)
  tradingview_symbol = 'AAPL'
  order_history = []  # List of dictionaries representing orders
  portfolio_value = 10000  # Placeholder

  return render_template('index.html', 
                         tradingview_symbol=tradingview_symbol,
                         order_history=order_history,
                         portfolio_value=portfolio_value)

if __name__ == '__main__':
  app.run(debug=True)
