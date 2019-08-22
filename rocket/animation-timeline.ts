import {
  Animation,
} from './rocket';

export interface AnimationTimelineConfig {
  beforeStart: () => Promise<void> | void;
  onStart: () => Promise<void> | void;

  beforeEach: () => Promise<void> | void;
  afterEach: () => Promise<void> | void;

  onComplete: () => void;
}

const ANIMATION_TIMELINE_DEFAULT_CONFIG: AnimationTimelineConfig = {
  beforeStart: () => Promise.resolve(),
  onStart: () => Promise.resolve(),
  afterEach: () => Promise.resolve(),
  beforeEach: () => Promise.resolve(),
  onComplete: () => undefined,
};

export interface AnimationTimelineEntry {
  delay: number;
  timingFunction: () => void;
  beforeStart: () => Promise<void>;
}

export class AnimationTimeline {
  public queue;
  public animation: Animation;
  public currentQueueIndex: number = 0;

  public config: AnimationTimelineConfig;

  constructor(config: Partial<AnimationTimelineConfig>) {
    this.config = {...ANIMATION_TIMELINE_DEFAULT_CONFIG};
    this.setConfig(config);

    this.animation = new Animation();

    this.queue = [];
  }

  public setConfig(config: Partial<AnimationTimelineConfig>): this {
    if (typeof config === 'object') {
      Object.assign(this.config, config);
    }

    return this;
  }

  public add() {}

  public play() {}

  public stop() {}
}
