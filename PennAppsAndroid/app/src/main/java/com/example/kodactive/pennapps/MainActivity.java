package com.example.kodactive.pennapps;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Locale;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Network;
import android.net.Uri;
import android.net.http.RequestQueue;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.speech.tts.TextToSpeech;
import android.util.Log;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.reimaginebanking.api.java.NessieClient;
import com.reimaginebanking.api.java.NessieException;
import com.reimaginebanking.api.java.NessieResultsListener;
import com.reimaginebanking.api.java.models.Customer;
import com.reimaginebanking.api.java.models.Merchant;
import com.reimaginebanking.api.java.models.Purchase;


import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import retrofit.client.Response;

import static java.lang.Integer.parseInt;

//import com.reimaginebanking.api.java.NessieClient;

public class MainActivity extends Activity {
    private final int SPEECH_RECOGNITION_CODE = 1;
    private TextView txtOutput;
    private ImageButton btnMicrophone;
    public static NessieClient nessieClient = NessieClient.getInstance();
    TextToSpeech ttobj;
    URL url;
    HttpURLConnection urlConnection = null;

    public void yesorno(String text) {
        if (text.equals("yes")) {
            ttobj.speak("good!", TextToSpeech.QUEUE_FLUSH, null);

        } else if (text.equals("no")) {
            ttobj.speak("Dialing capital one now", TextToSpeech.QUEUE_FLUSH, null);
            Intent intent = new Intent(Intent.ACTION_DIAL);
            intent.setData(Uri.parse("tel:1(877)383-4802"));
            startActivity(intent);
        } else {
            System.out.println("other");
        }
    }

    public void detectCrosswalk() {
        // Instantiate the RequestQueue.
        com.android.volley.RequestQueue queue = Volley.newRequestQueue(this);
        String url = "https://penn-apps.herokuapp.com/test";

// Request a string response from the provided URL.
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                new com.android.volley.Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {

                        if (response.equals("crosswalk")) {
                            System.out.println("RESPONSEHERE");
                            System.out.println(response);
                            ttobj.speak("ALERT! YOU ARE WALKING INTO A CROSSWALK!!!", TextToSpeech.QUEUE_FLUSH, null);

                        }
                        // Display the first 500 characters of the response string.
                        // mTextView.setText("Response is: "+ response.substring(0,500));
                    }
                }, new com.android.volley.Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("That didn't work!");
            }
        });
// Add the request to the RequestQueue.
        queue.add(stringRequest);
    }

    public void whoIsThat(String text) {
        if (text.contains("who is that")) {
            // Instantiate the RequestQueue.
            com.android.volley.RequestQueue queue = Volley.newRequestQueue(this);
            String url = "https://penn-apps.herokuapp.com/whoIsThat";

// Request a string response from the provided URL.
            StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                    new com.android.volley.Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            System.out.println("RESPONSEHERE");
                            System.out.println(response);
                            if (response.equals("stranger"))
                                ttobj.speak("That is a stranger, you are not friends with this person on Facebook", TextToSpeech.QUEUE_FLUSH, null);
                            else
                                ttobj.speak("That is your Facebook friend" + response + "Go say Hi!", TextToSpeech.QUEUE_FLUSH, null);

                            // Display the first 500 characters of the response string.
                            // mTextView.setText("Response is: "+ response.substring(0,500));
                        }
                    }, new com.android.volley.Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    System.out.println("That didn't work!");
                }
            });
// Add the request to the RequestQueue.
            queue.add(stringRequest);
        }
    }


    public void whatIsThat(String text) {
        if (text.contains("what is that")) {
            // Instantiate the RequestQueue.
            com.android.volley.RequestQueue queue = Volley.newRequestQueue(this);
            String url = "https://penn-apps.herokuapp.com/whatIsThat";

// Request a string response from the provided URL.
            StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                    new com.android.volley.Response.Listener<String>() {
                        @Override
                        public void onResponse(String response) {
                            System.out.println("RESPONSEHERE");
                            System.out.println(response);
                            ttobj.speak("That is a " + response, TextToSpeech.QUEUE_FLUSH, null);
                            // Display the first 500 characters of the response string.
                            // mTextView.setText("Response is: "+ response.substring(0,500));
                        }
                    }, new com.android.volley.Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    System.out.println("That didn't work!");
                }
            });
// Add the request to the RequestQueue.
            queue.add(stringRequest);
        }
    }

    public void nessieIntegration(final String text) {
        // if (text.contains("Dunkin") || text.contains("AT&T") || text.contains("Radioshack") || text.contains("Buffalo Wild Wings")) {
        //  if (text.contains("Nessie") || text.contains ("nessie")){
        System.out.println("nessierun");
        nessieClient.getPurchases("5877e7481756fc834d8eace6", new NessieResultsListener() {
            @Override
            public void onSuccess(Object o, NessieException e) {
                ArrayList<Purchase> purchases = (ArrayList<Purchase>) o;
                ArrayList<Purchase> latestPurchases = new ArrayList<Purchase>();
                for (int index = purchases.size() - 5; index < purchases.size(); index++) {
                    latestPurchases.add(purchases.get(index));
                }

                if (text.contains("Donuts")) {
                    System.out.println("nessierun2");
                    String d = latestPurchases.get(1).toString();
                    String amtString = d.substring(d.indexOf("amount"));
                    String finalAmtString = amtString.substring(amtString.indexOf('=') + 1, amtString.indexOf(','));
                    Double d1 = Double.parseDouble(finalAmtString);
                    ttobj.speak("Your recent transaction at Dunkin was" + d1 + "dollars. Is that what you expected?", TextToSpeech.QUEUE_FLUSH, null);
                    startSpeechToText();

                }
                if (text.contains("AT&T")) {
                    String d = latestPurchases.get(0).toString();
                    String amtString = d.substring(d.indexOf("amount"));
                    String finalAmtString = amtString.substring(amtString.indexOf('=') + 1, amtString.indexOf(','));
                    Double d1 = Double.parseDouble(finalAmtString);
                    ttobj.speak("Your recent transaction at AT&T was" + d1 + "dollars. Is that what you expected?", TextToSpeech.QUEUE_FLUSH, null);
                    startSpeechToText();
                }
                if (text.contains("Dollar Tree")) {
                    String d = latestPurchases.get(3).toString();
                    String amtString = d.substring(d.indexOf("amount"));
                    String finalAmtString = amtString.substring(amtString.indexOf('=') + 1, amtString.indexOf(','));
                    Double d1 = Double.parseDouble(finalAmtString);
                    ttobj.speak("Your recent transaction at Dollar Tree was" + d1 + "dollars. Is that what you expected?", TextToSpeech.QUEUE_FLUSH, null);
                    startSpeechToText();
                }
                if (text.contains("Buffalo Wild Wing")) {
                    String d = latestPurchases.get(2).toString();
                    String amtString = d.substring(d.indexOf("amount"));
                    String finalAmtString = amtString.substring(amtString.indexOf('=') + 1, amtString.indexOf(','));
                    Double d1 = Double.parseDouble(finalAmtString);
                    ttobj.speak("Your recent transaction at Buffalo Wild Wings was" + d1 + "dollars. Is that what you expected?", TextToSpeech.QUEUE_FLUSH, null);
                    startSpeechToText();
                }





                   /*
                    String amt = purchases.get(purchases.size() - 1).toString();
                    String amtString = amt.substring(amt.indexOf("amount"));
                    String finalAmtString = amtString.substring(amtString.indexOf('=') + 1, amtString.indexOf(','));
                    System.out.println("LOOK HERE lol");
                    */
                //  System.out.println(purchases);
                //  double amount = Double.parseDouble(finalAmtString);
                //System.out.println(amount);
                //if ((double) userAmount == amount) {
                //  ttobj.speak("That was a valid transaction. Your most recent transaction was" + amount + "dollars", TextToSpeech.QUEUE_FLUSH, null);
                //} else {
                //  ttobj.speak("That transaction was invalid. You stated the amount was" + userAmount + "but " + amount + "was removed from your account", TextToSpeech.QUEUE_FLUSH, null);
                //}


            }
        });
    }
    //}


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        nessieClient.setAPIKey("b86dd9297128e1a6a6b8e0821692d691");
        txtOutput = (TextView) findViewById(R.id.txt_output);
        btnMicrophone = (ImageButton) findViewById(R.id.btn_mic);

        ttobj = new TextToSpeech(getApplicationContext(), new TextToSpeech.OnInitListener() {
            @Override
            public void onInit(int status) {
                ttobj.setLanguage(Locale.UK);
            }
        });

        btnMicrophone.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startSpeechToText();
            }
        });
//fix datarace if its a problem (try synchronizing and put up a lock)
        new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    try {
                        Thread.sleep(10000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                    detectCrosswalk();
                }
            }
        }).start();
    }


    /**
     * Start speech to text intent. This opens up Google Speech Recognition API dialog box to listen the speech input.
     */
    private void startSpeechToText() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT,
                "Speak something...");
        try {
            startActivityForResult(intent, SPEECH_RECOGNITION_CODE);
        } catch (ActivityNotFoundException a) {
            Toast.makeText(getApplicationContext(),
                    "Sorry! Speech recognition is not supported in this device.",
                    Toast.LENGTH_SHORT).show();
        }
    }

    /**
     * Callback for speech recognition activity
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case SPEECH_RECOGNITION_CODE: {
                if (resultCode == RESULT_OK && null != data) {
                    ArrayList<String> result = data
                            .getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                    String text = result.get(0);
                    txtOutput.setText(text);
                    String x = "";
                    nessieIntegration(text);
                    whatIsThat(text);
                    whoIsThat(text);
                    yesorno(text);
                }
                break;
            }
        }
    }
}
/*
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.media.AudioManager;
import android.media.MediaRecorder;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;

public class MainActivity extends AppCompatActivity {
private String TAG = "bluetoothStuff";

    private BroadcastReceiver mBluetoothScoReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            int state = intent.getIntExtra(AudioManager.EXTRA_SCO_AUDIO_STATE, -1);

            if (state == AudioManager.SCO_AUDIO_STATE_CONNECTED) {
                Log.d(TAG, "BLUETOOTHWORKING1");

               MediaRecorder recorder = new MediaRecorder();
                recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
                recorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
                recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);

                // Start recording audio
            }
        }
    };



    @Override
    protected void onResume() {
        super.onResume();

        IntentFilter intentFilter = new IntentFilter(AudioManager.ACTION_SCO_AUDIO_STATE_UPDATED);
        Intent intent = registerReceiver(mBluetoothScoReceiver, intentFilter);
        if (intent == null) {
            Log.e(TAG, "Failed to register bluetooth sco receiver...");
            return;
        }

        int state = intent.getIntExtra(AudioManager.EXTRA_SCO_AUDIO_STATE, -1);
        if (state == AudioManager.SCO_AUDIO_STATE_CONNECTED) {
            // Start recording
            Log.d(TAG, "BLUETOOTHWORKING2");

        }

        // Ensure the SCO audio connection stays active in case the
        // current initiator stops it.
        AudioManager audioManager = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
        audioManager.startBluetoothSco();
    }





    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

    }
}

*/