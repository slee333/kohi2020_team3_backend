import json
import pandas as pd
import pathlib
import sys
# print("Script loaded!")

import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'
import tensorflow as tf

# Make code to read stdin. JSON format?
# Parse JSON file and build input matrices
# Be aware of the order

ftrs_cont = ['age', 'bmi', 'preop_hb', 'preop_wbc', 'preop_plt',
             'preop_glu', 'preop_na', 'preop_k', 'preop_alb',
             'preop_pt', 'preop_ptt', 'preop_gpt', 'preop_got', 'preop_bun', 'preop_cr']

# 특이사항:
#   bmi: 정상군 (18.5~23) 묶어 평균 설정. 정상 범위가 2std 안이라 간주
#   Hb: 남녀 사이 차이가 있는데 한데 묶어 처리함. 11~17
#   나이: 편차를 구할 수 없었음. 평균은 42.7이나, normal distribution이 아닌걸 감안. 병원들의 대체적인 평균인 50으로 정했는데, 이게 오류를 부를수도?

ftrs_mean = [50, 20.75, 14.5, 7.75,  300, 87.5,
             140.5, 4.25, 4.45, 1, 30, 17.5, 17.5, 14, 1]
ftrs_stds = [16, 1.125, 1.25, 1.625, 75, 8.75, 2.25,
             0.375, 0.475, 0.1, 2.5, 8.75, 8.75, 3, 0.15]
ftrs_stat = pd.DataFrame(
    {'mean': ftrs_mean, 'std': ftrs_stds}, index=ftrs_cont)

ftrs = ['age', 'sex', 'emop', 'bmi', 'preop_hb', 'preop_wbc', 'preop_plt', 'preop_glu',
        'preop_na', 'preop_k', 'preop_alb', 'preop_pt', 'preop_ptt',
        'preop_gpt', 'preop_got', 'preop_bun', 'preop_cr']


def clinical_zscore(df):
    # 성별은 예외
    df_tmp = df.copy()
    for ftr in ftrs_stat.index:
        temp = df_tmp[ftr]
        df_tmp.loc[:, ftr] = (temp - ftrs_stat.loc[ftr]
                              ['mean'])/ftrs_stat.loc[ftr]['std']
    return df_tmp


def medianImputer(df):
  return df.fillna(df.median())


def preprocess_features(X):
  # Data Imputation
  X = medianImputer(X)
  # Data Normalization
  gender = X['sex'].copy()
  emop = X['emop'].copy()
  if 'asa' in X.columns:
    asa = X['asa'].copy()

  X = clinical_zscore( X )
  X.loc[:,'sex'] = gender
  X.loc[:,'emop'] = emop
  if 'asa' in X.columns:
    X.loc[:,'asa'] = asa

  return X

def one_hot_asa( data ):
  data_1 = data.drop(columns=['asa'])
  data_2 = 1*(data['asa'] <= 1)
  data_3 = 1*(data['asa'] > 2)

  return data_1, data_2, data_3

cwd = pathlib.Path(__file__).parent.absolute()
data = pd.DataFrame(json.loads(sys.argv[1]), index=[1])
mode = data.loc[1,'mode']
modelname = data.loc[1,'modelname']

if modelname == 'DNN':
    model = tf.keras.models.load_model(os.path.join(cwd, 'models', f'{modelname}_{mode}'))
    input_data = preprocess_features(data[ftrs])
    output_softmax = model.predict_proba( input_data )[0][0]
    output_class = round(output_softmax)
elif modelname =='ASADNN':
    model = tf.keras.models.load_model(os.path.join(cwd, 'models', f'{modelname}_{mode}'))
    input_data = preprocess_features(data[ftrs+['asa']])
    output_softmax = model.predict(one_hot_asa( input_data ))[0][0]
    output_class = round(output_softmax)
else:
    output_softmax = 'Not supported'
    output_class = 'Not supported'

output_obj = {
    "modelname": modelname,
    "mode": mode,
    "output_softmax": output_softmax,
    "output_class": output_class
}

print( output_obj )

