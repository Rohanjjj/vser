import streamlit as st
import requests
import pickle

# API URL (Replace with the correct Express server URL)
API_URL = 'http://localhost:5000/'

# Load model if available
MODEL_FILE = 'sign_language_model.pkl'
try:
    with open(MODEL_FILE, 'rb') as f:
        model = pickle.load(f)
except FileNotFoundError:
    model = None

st.title('Gesture Data Receiver')

# Display incoming sensor data
st.write('Waiting for sensor data from the server...')

# Function to receive data from Express server and save it to a pickle file
def receive_and_save_data():
    try:
        response = requests.post(API_URL, json={
            "sensorData": {
                "flex1": st.number_input('Flex1'),
                "flex2": st.number_input('Flex2'),
                "flex3": st.number_input('Flex3'),
                "flex4": st.number_input('Flex4'),
                "ax": st.number_input('Ax'),
                "ay": st.number_input('Ay'),
                "az": st.number_input('Az'),
                "gx": st.number_input('Gx'),
                "gy": st.number_input('Gy'),
                "gz": st.number_input('Gz')
            }
        })

        if response.status_code == 200:
            gesture = response.text
            st.success(f"Received Gesture: {gesture}")

            # Save data to a pickle file
            data = {
                'gesture': gesture,
                'flex1': st.session_state['flex1'],
                'flex2': st.session_state['flex2'],
                'flex3': st.session_state['flex3'],
                'flex4': st.session_state['flex4'],
                'ax': st.session_state['ax'],
                'ay': st.session_state['ay'],
                'az': st.session_state['az'],
                'gx': st.session_state['gx'],
                'gy': st.session_state['gy'],
                'gz': st.session_state['gz']
            }

            with open('gesture_data.pkl', 'ab') as f:
                pickle.dump(data, f)
            st.success("Data saved to gesture_data.pkl")
        else:
            st.error("Failed to receive data")
    except Exception as e:
        st.error(f"Error: {e}")

if st.button('Receive and Save Data'):
    receive_and_save_data()
