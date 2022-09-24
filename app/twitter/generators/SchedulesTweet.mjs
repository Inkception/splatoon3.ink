import TweetGenerator from "./TweetGenerator.mjs";
import Media from "../Media.mjs";
import { useAnarchyOpenSchedulesStore, useAnarchySeriesSchedulesStore, useRegularSchedulesStore, useSplatfestSchedulesStore } from "../../../src/stores/schedules.mjs";
import { useUSSplatfestsStore } from '../../../src/stores/splatfests.mjs';
export default class SchedulesTweet extends TweetGenerator
{
  key = 'schedules';
  name = 'Schedules';

  async getStages() {
    await this.preparePinia();

    return {
      regular: useRegularSchedulesStore().activeSchedule,
      anarchySeries: useAnarchySeriesSchedulesStore().activeSchedule,
      anarchyOpen: useAnarchyOpenSchedulesStore().activeSchedule,
      splatfest: useSplatfestSchedulesStore().activeSchedule,
      tricolor: useUSSplatfestsStore().tricolor,
    }
  }

  async getDataTime() {
    await this.preparePinia();

    let schedule = (await this.getStages()).regular;

    return Date.parse(schedule.startTime);
  }

  async _getStatus() {
    let stages = await this.getStages();

    if (stages.splatfest?.settings) {
      let festStages = stages.splatfest.settings.vsStages;

      if (stages.tricolor?.isTricolorActive) {
        return `Join the global Splatfest Battle on ${festStages[0].name}, ${festStages[1].name}, and Tricolor Battle on ${stages.tricolor.tricolorStage.name}! #splatfest #maprotation`;
      }

      return `Join the global Splatfest Battle on ${festStages[0].name} and ${festStages[1].name}! #splatfest #maprotation`;
    }

    return `Splatoon 3 map rotation: Anarchy (Series) game mode: ${stages.anarchySeries.settings.vsRule.name}, Anarchy (Open) game mode: ${stages.anarchyOpen.settings.vsRule.name} #maprotation`;
  }

  /** @param {ScreenshotHelper} screenshotHelper */
  async _getMedia(screenshotHelper) {
    let stages = await this.getStages();

    // If the Tricolor stage is active, we need to make the image size a little taller
    let viewport = stages.tricolor?.isTricolorActive
      ? { height: 925 }
      : { };

    let media = new Media;
    media.file = await screenshotHelper.capture('schedules', { viewport });

    let detail = s => `${s.settings.vsRule.name} on ${s.settings.vsStages[0].name} and ${s.settings.vsStages[1].name}`;

    let lines = ['Splatoon 3 map rotation:\n'];

    if (stages.splatfest?.settings) {
      lines.push(...[
        `Splatfest Battle: ${detail(stages.splatfest)}`,
      ]);

      if (stages.tricolor?.isTricolorActive) {
        lines.push(`Tricolor Battle: ${stages.tricolor.tricolorStage.name}`);
      }
    } else {
      lines.push(...[
        `Regular Battle: ${detail(stages.regular)}`,
        `Anarchy Battle (Series): ${detail(stages.anarchySeries)}`,
        `Anarchy Battle (Open): ${detail(stages.anarchyOpen)}`,
      ]);
    }

    media.altText = lines.filter(l => l).join('\n');

    return media;
  }
}
