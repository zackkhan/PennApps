from watson_developer_cloud import VisualRecognitionV3 as VisualRecognition

visual_recognition = VisualRecognition(
    api_key='7fdd5475b2518cc0080389eb5faf6e034d0db7bd')


with open(join(dirname(__file__), './go.zip'), 'rb') as go, \
      open(join(dirname(__file__), './stop.zip'),'rb') as stop, \
      open(join(dirname(__file__), './negative.zip'), 'rb') as negative:
   print(json.dumps(visual_recognition.create_classifier('crosswalks', go_positive_examples=go, stop_positive_examples=stop, negative_examples=negative), indent=2))
