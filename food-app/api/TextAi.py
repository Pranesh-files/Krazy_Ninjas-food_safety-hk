import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the dataset
file_path = './food-app/src/components/FoodAI (2) (1) (2).xlsx'
data = pd.read_excel(file_path)

# Clean data and encode features
data_cleaned = data.dropna(subset=['Result (0 = fresh, 1 = spoiled)'])
data_cleaned.columns = data_cleaned.columns.str.strip()
data_cleaned['Shelf Life at Room Temperature (20-25°C)'] = pd.to_numeric(
    data_cleaned['Shelf Life at Room Temperature (20-25°C)'], errors='coerce'
)

label_encoder_smell = LabelEncoder()
label_encoder_spoilage = LabelEncoder()
data_cleaned['Smell_encoded'] = label_encoder_smell.fit_transform(data_cleaned['Smell'].fillna('Unknown'))
data_cleaned['Spoilage_encoded'] = label_encoder_spoilage.fit_transform(data_cleaned['Spoilage'].fillna('Unknown'))

X = data_cleaned[['Shelf Life at Room Temperature (20-25°C)', 'Smell_encoded', 'Spoilage_encoded']]
y = data_cleaned['Result (0 = fresh, 1 = spoiled)']

# Handle missing values in features using SimpleImputer
imputer = SimpleImputer(strategy='mean')
X_imputed = imputer.fit_transform(X)

# Split data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X_imputed, y, test_size=0.2, random_state=42)

# Initialize and train models
logistic_model = LogisticRegression()
logistic_model.fit(X_train, y_train)

random_forest_model = RandomForestClassifier()
random_forest_model.fit(X_train, y_train)

# API route for prediction
@app.route('/api/TextAi', methods=['POST'])
def GenResult():
    try:
        data = request.get_json()

        days = data.get('days')
        smell = data.get('smell')
        spoilage = data.get('spoilage')

        if days is None or smell is None or spoilage is None:
            return jsonify({"error": "Please provide all the required values: Days, Smell, and Spoilage"}), 400

        # Encode smell and spoilage
        try:
            smell_encoded = label_encoder_smell.transform([smell])[0]
            spoilage_encoded = label_encoder_spoilage.transform([spoilage])[0]
        except ValueError:
            return jsonify({"error": "Invalid smell or spoilage values"}), 400

        # Prepare new data for prediction
        new_data = [[days, smell_encoded, spoilage_encoded]]

        # Make a prediction with the random forest model
        rf_prediction = random_forest_model.predict(new_data)

        # Return result based on the prediction
        result = 'Fresh' if rf_prediction[0] == 0 else 'Spoiled'
        return jsonify({'result': result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
