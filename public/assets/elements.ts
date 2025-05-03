import { ElementCategory, ElementType } from "../../src/app/lib/types";

// Face SVGs
import faceOval from "./svgs/face-oval.png";
import faceRound from "./svgs/face-round.svg";
import faceSquare from "./svgs/face-square.svg";
import faceHeart from "./svgs/face-heart.svg";

// Eyes SVGs
import eyesRound from "./svgs/eyes-round.svg";
import eyesAlmond from "./svgs/eyes-almond.svg";
import eyesHooded from "./svgs/eyes-hooded.svg";
import eyesDownturned from "./svgs/eyes-downturned.svg";

// Nose SVGs
import noseStraight from "./svgs/nose-straight.svg";
import noseButton from "./svgs/nose-button.svg";
import noseRoman from "./svgs/nose-roman.svg";
import noseSnub from "./svgs/nose-snub.svg";

// Mouth SVGs
import mouthFull from "./svgs/mouth-full.svg";
import mouthThin from "./svgs/mouth-thin.svg";
import mouthWide from "./svgs/mouth-wide.svg";
import mouthBow from "./svgs/mouth-bow.svg";

// Hair SVGs
import hairShort from "./svgs/hair-short.svg";
import hairLong from "./svgs/hair-long.svg";
import hairCurly from "./svgs/hair-curly.svg";
import hairBald from "./svgs/hair-bald.svg";

export const categories = [
  {
    type: ElementType.Face,
    label: "Face",
    elements: [
      {
        id: "face-oval",
        type: ElementType.Face,
        subtype: "oval",
        src: faceOval,
        label: "Oval Face"
      },
      {
        id: "face-round",
        type: ElementType.Face,
        subtype: "round",
        src: faceRound,
        label: "Round Face"
      },
      {
        id: "face-square",
        type: ElementType.Face,
        subtype: "square",
        src: faceSquare,
        label: "Square Face"
      },
      {
        id: "face-heart",
        type: ElementType.Face,
        subtype: "heart",
        src: faceHeart,
        label: "Heart Face"
      }
    ]
  },
  {
    type: ElementType.Eyes,
    label: "Eyes",
    elements: [
      {
        id: "eyes-round",
        type: ElementType.Eyes,
        subtype: "round",
        src: eyesRound,
        label: "Round Eyes"
      },
      {
        id: "eyes-almond",
        type: ElementType.Eyes,
        subtype: "almond",
        src: eyesAlmond,
        label: "Almond Eyes"
      },
      {
        id: "eyes-hooded",
        type: ElementType.Eyes,
        subtype: "hooded",
        src: eyesHooded,
        label: "Hooded Eyes"
      },
      {
        id: "eyes-downturned",
        type: ElementType.Eyes,
        subtype: "downturned",
        src: eyesDownturned,
        label: "Downturned Eyes"
      }
    ]
  },
  {
    type: ElementType.Nose,
    label: "Nose",
    elements: [
      {
        id: "nose-straight",
        type: ElementType.Nose,
        subtype: "straight",
        src: noseStraight,
        label: "Straight Nose"
      },
      {
        id: "nose-button",
        type: ElementType.Nose,
        subtype: "button",
        src: noseButton,
        label: "Button Nose"
      },
      {
        id: "nose-roman",
        type: ElementType.Nose,
        subtype: "roman",
        src: noseRoman,
        label: "Roman Nose"
      },
      {
        id: "nose-snub",
        type: ElementType.Nose,
        subtype: "snub",
        src: noseSnub,
        label: "Snub Nose"
      }
    ]
  },
  {
    type: ElementType.Mouth,
    label: "Mouth",
    elements: [
      {
        id: "mouth-full",
        type: ElementType.Mouth,
        subtype: "full",
        src: mouthFull,
        label: "Full Lips"
      },
      {
        id: "mouth-thin",
        type: ElementType.Mouth,
        subtype: "thin",
        src: mouthThin,
        label: "Thin Lips"
      },
      {
        id: "mouth-wide",
        type: ElementType.Mouth,
        subtype: "wide",
        src: mouthWide,
        label: "Wide Smile"
      },
      {
        id: "mouth-bow",
        type: ElementType.Mouth,
        subtype: "bow",
        src: mouthBow,
        label: "Bow Shaped"
      }
    ]
  },
  {
    type: ElementType.Hair,
    label: "Hair",
    elements: [
      {
        id: "hair-short",
        type: ElementType.Hair,
        subtype: "short",
        src: hairShort,
        label: "Short Hair"
      },
      {
        id: "hair-long",
        type: ElementType.Hair,
        subtype: "long",
        src: hairLong,
        label: "Long Hair"
      },
      {
        id: "hair-curly",
        type: ElementType.Hair,
        subtype: "curly",
        src: hairCurly,
        label: "Curly Hair"
      },
      {
        id: "hair-bald",
        type: ElementType.Hair,
        subtype: "bald",
        src: hairBald,
        label: "Bald"
      }
    ]
  },
  {
    type: ElementType.Hairs,
    label: "Hairs",
    elements: [
      {
        id: "hair-short",
        type: ElementType.Hair,
        subtype: "short",
        src: hairShort,
        label: "Short Hair"
      },
      {
        id: "hair-long",
        type: ElementType.Hair,
        subtype: "long",
        src: hairLong,
        label: "Long Hair"
      },
      {
        id: "hair-curly",
        type: ElementType.Hair,
        subtype: "curly",
        src: hairCurly,
        label: "Curly Hair"
      },
      {
        id: "hair-bald",
        type: ElementType.Hair,
        subtype: "bald",
        src: hairBald,
        label: "Bald"
      }
    ]
  },
];
