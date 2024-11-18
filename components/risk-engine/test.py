import requests
import uuid
import pandas as pd
pd.options.mode.chained_assignment = None
import numpy as np
import json

max_runs = 1

def is_nan(value):
    # print(f"Checking if value is NaN: {value}")
    if str(value) == 'nan':
        return True
    try:
        if bool(value == value) == False:
            return True
    except Exception:
        pass
    try:
        if bool(np.isnan(value)) == True:
            return True
    except Exception:
        pass

    try:
        if bool(pd.isnull(value)) == True:
            return True
    except Exception:
        pass
    return False


def load_df():
    f = 'resources/data/20240914_test_data_for_risk_api.csv'
    return pd.read_csv(f)


def get_data():
    df = load_df()
    # df = df[df['client_id'].isin([894118])]
    res = []
    for i in range(0, len(df)):
        row = df.iloc[i]

        try:
            row['client_id'] = int(row['client_id'])
        except Exception:
            pass

        try:
            row['club_level'] = int(row['club_level'])
            row['club_level'] = str(row['club_level'])
        except Exception:
            row['club_level'] = None

        row['client_id_old'] = row['client_id']
        row['client_id'] = str(uuid.uuid4())
        row['phone_number_2'] = None
        row['mobile_os_type'] = None
        row['net_income'] = int(row['net_income'])
        row['net_burden'] = int(row['net_burden'])
        row['ssn'] = str(row['ssn'])
        row['phone_number_1'] = str(row['phone_number_1'])
        row['club_level'] = None if is_nan(row['club_level']) else row['club_level']
        row['car_model_year'] = None if is_nan(row['car_model_year']) else row['car_model_year']
        row['iscore_score'] = None if is_nan(row['iscore_score']) else row['iscore_score']
        row['iscore_report'] = None if is_nan(row['iscore_report']) else row['iscore_report']
        # row['iscore_report'] = str(row['iscore_report'])

        # Debug prints to check values
        # print(f"Row {i} - iscore_score: {row['iscore_score']}, iscore_report: {row['iscore_report']}")

        # row as dict
        data = row.to_dict()
        del data['is_iscore']
        del data['job_map_max_salary']
        del data['job_map_min_salary']
        del data['scoring_scenario']

        if data['iscore_score'] is None:
            del data['iscore_score']
            del data['iscore_report']
        else:
            data['iscore'] = {'iscore_score': data['iscore_score'], 'iscore_report': data['iscore_report']}
            del data['iscore_score']
            del data['iscore_report']
            
        res.append(data)
    with open('resources/data/20240914_test_data_for_risk_api.json', 'w', encoding='utf-8') as f:
        json.dump(res, f, ensure_ascii=False)


def load_json_data():
    with open('resources/data/20240914_test_data_for_risk_api.json', 'r', encoding='utf-8') as f:
        return json.load(f)


def get_score():
    total_success = 0
    total_failed = 0
    generic_error = 0
    url = 'http://localhost:8000/api/risk/score'
    # url = 'https://risk-engine-mylo-test.myloapp.com/api/risk/score'

    data = load_json_data()
    obj = {}
    successful_responses = []
    iteration_count = 0
    for d in data:
        if iteration_count >= max_runs:
            break
        client_id_old = d['client_id_old']
        del d['client_id_old']
        obj = {
            "booking_time": "2023-01-01T00:00:00",
            "scenario": "SCORING",
            'data': d
        }
        
        # Print the object being sent to the API
        # print(f'Sending object to API: {json.dumps(obj, indent=2)}')
        
        try:
            response = requests.post(url, json=obj, headers={'Content-Type': 'application/json', 'api-key': 'CAS49d103a36844249fd2D32142a8d8EdF2'})
            if response.status_code == 200:
                print(f'scored ssn: {d["ssn"]}')
                total_success += 1
                response_data = response.json()
                response_data['client_id_old'] = client_id_old
                successful_responses.append(response_data)
            else:
                print(f' >>>>>>>>>>>>>>>>>>>> error in scoring ssn: {d["ssn"]}, status code: {response.status_code}, response: {response.text}')
                total_failed += 1
        except Exception as e:
            print(f' >>>>>>>>>>>>>>>>>>>> error in scoring ssn: {d["ssn"]}, error: {e}')
            generic_error += 1
        print(f'total_success: {total_success}, total_failed: {total_failed}, generic_error: {generic_error}')
        iteration_count += 1
    
    # Save successful responses to a DataFrame and then to a CSV file
    if successful_responses:
        df_responses = pd.DataFrame(successful_responses)
        # Ensure client_id_old is the first column
        columns = ['client_id_old'] + [col for col in df_responses.columns if col != 'client_id_old']
        df_responses = df_responses[columns]
        # print(obj)
        df_responses.to_csv('resources/data/20240916_response.csv', index=False)


if __name__ == '__main__':
    # get_data()
    get_score()