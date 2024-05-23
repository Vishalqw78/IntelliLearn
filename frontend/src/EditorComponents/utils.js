export const regex = /^https:/;

export interface GetEmbedUrlOptions {
  url: string;
  allowFullscreen?: boolean;
  autoplay?: boolean;
  ccLanguage?: string;
  ccLoadPolicy?: boolean;
  controls?: boolean;
  disableKBcontrols?: boolean;
  enableIFrameApi?: boolean;
  endTime?: number;
  interfaceLanguage?: string;
  ivLoadPolicy?: number;
  loop?: boolean;
  modestBranding?: boolean;
  nocookie?: boolean;
  origin?: string;
  playlist?: string;
  progressBarColor?: string;
  startAt?: number;
}

export const getEmbedUrlFromYoutubeUrl = (options: GetEmbedUrlOptions) => {
  const {
    url,
    allowFullscreen,
    autoplay,
    ccLanguage,
    ccLoadPolicy,
    controls,
    disableKBcontrols,
    enableIFrameApi,
    endTime,
    interfaceLanguage,
    ivLoadPolicy,
    loop,
    modestBranding,
    nocookie,
    origin,
    playlist,
    progressBarColor,
    startAt,
  } = options;

  // if is a youtu.be url, get the id after the /

  let outputUrl = `${url}`;

  const params = [];

  if (allowFullscreen === false) {
    params.push("fs=0");
  }

  if (autoplay) {
    params.push("autoplay=1");
  }

  if (ccLanguage) {
    params.push(`cc_lang_pref=${ccLanguage}`);
  }

  if (ccLoadPolicy) {
    params.push("cc_load_policy=1");
  }

  if (!controls) {
    params.push("controls=0");
  }

  if (disableKBcontrols) {
    params.push("disablekb=1");
  }

  if (enableIFrameApi) {
    params.push("enablejsapi=1");
  }

  if (endTime) {
    params.push(`end=${endTime}`);
  }

  if (interfaceLanguage) {
    params.push(`hl=${interfaceLanguage}`);
  }

  if (ivLoadPolicy) {
    params.push(`iv_load_policy=${ivLoadPolicy}`);
  }

  if (loop) {
    params.push("loop=1");
  }

  if (modestBranding) {
    params.push("modestbranding=1");
  }

  if (origin) {
    params.push(`origin=${origin}`);
  }

  if (playlist) {
    params.push(`playlist=${playlist}`);
  }

  if (startAt) {
    params.push(`start=${startAt}`);
  }

  if (progressBarColor) {
    params.push(`color=${progressBarColor}`);
  }

  if (params.length) {
    outputUrl += `?${params.join("&")}`;
  }

  return outputUrl;
};
