export default function Shortcut({ link, img, name }) {
    return (
            <a href={link} className="shortcut_item">
        <img src={img} alt="" />
        <span>{name}</span>
      </a>
    );
  }