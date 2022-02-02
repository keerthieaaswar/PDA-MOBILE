package com.pda;

import android.app.Application;
import androidx.multidex.MultiDex;
import androidx.multidex.MultiDexApplication;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.clevertap.android.sdk.ActivityLifecycleCallback;
import com.clevertap.android.sdk.CleverTapAPI;
import com.clevertap.react.CleverTapPackage;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.geolocation.GeolocationPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import com.pusherman.networkinfo.RNNetworkInfoPackage;
import com.brentvatne.react.ReactVideoPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.horcrux.svg.SvgPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lewin.qrcode.QRScanReaderPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;

import org.reactnative.camera.RNCameraPackage;
import org.wonday.pdf.RCTPdfView;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;
import cl.json.ShareApplication;

public class MainApplication extends MultiDexApplication implements ReactApplication, ShareApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage(),
            new RNPermissionsPackage(),
            new GeolocationPackage(),
            new RNCWebViewPackage(),
            new RNFusedLocationPackage(),
            new RNNetworkInfoPackage(),
            new ReactVideoPackage(),
            new RNSensitiveInfoPackage(),
              new RNDeviceInfo(),
              new LinearGradientPackage(),
              new CleverTapPackage(),
              new QRScanReaderPackage(),
              new RNCameraPackage(),
              new RNSharePackage(),
              new RNFetchBlobPackage(),
              new SvgPackage(),
              new PickerPackage(),
              new RNI18nPackage(),
              new RNSpinkitPackage(),
              new VectorIconsPackage(),
              new RCTPdfView()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    CleverTapAPI.setDebugLevel(CleverTapAPI.LogLevel.DEBUG);
    // Register the CleverTap ActivityLifecycleCallback
    ActivityLifecycleCallback.register(this);
    SoLoader.init(this, /* native exopackage */ false);
    MultiDex.install(this);
  }

  @Override
  public String getFileProviderAuthority() {
    return BuildConfig.APPLICATION_ID + ".provider";
  }
}
