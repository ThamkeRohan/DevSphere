export default function ContributionCard({icon, text}) {
    return (
      <li className="contribution-card">
        {icon}
        <p className="text-sm">{text}</p>
      </li>
    );
}