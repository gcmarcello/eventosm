import FacebookIcon from "node_modules/odinkit/src/icons/FacebookIcon";
import XIcon from "node_modules/odinkit/src/icons/TwitterIcon";
import WhatsappIcon from "node_modules/odinkit/src/icons/WhatsappIcon";
import { Link } from "odinkit/client";

export function FacebookShareButton({
  size = 22,
  link,
}: {
  size?: number;
  link: string;
}) {
  return (
    <Link
      target="_blank"
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`}
    >
      <FacebookIcon size={size} />
    </Link>
  );
}

export function TwitterShareButton({
  size = 22,
  link,
  text,
}: {
  size?: number;
  link: string;
  text: string;
}) {
  return (
    <Link
      target="_blank"
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}%2E+Acesse+no+link%3A++${encodeURIComponent(link)}`}
    >
      <XIcon size={size} />
    </Link>
  );
}

export function WhatsappShareButton({
  size = 22,
  link,
  text,
}: {
  size?: number;
  link: string;
  text: string;
}) {
  return (
    <Link
      target="_blank"
      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}%2E+Acesse+no+link%3A++${encodeURIComponent(link)}`}
    >
      <WhatsappIcon size={size} />
    </Link>
  );
}
