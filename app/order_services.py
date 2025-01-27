import threading
import time
from app import app
from app.models import db, Order

def update_order_status(order_id, new_status):
    with app.app_context():
        order = Order.query.get(order_id)
        if order:
            order.status = new_status
            db.session.commit()

def dispatch_order_schedule(order_id):
    def run():
        time.sleep(20)
        update_order_status(order_id, 2)
        time.sleep(20)
        update_order_status(order_id, 3)
    threading.Thread(target=run, daemon=True).start()
