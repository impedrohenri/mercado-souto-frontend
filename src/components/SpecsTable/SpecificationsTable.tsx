type Attribute = {
  id: string;
  text: string;
};

type SpecSection = {
  title: string;
  attributes: Attribute[];
};

type SpecificationsProps = {
  specifications: SpecSection[] | undefined;
  className?: string
};

export default function SpecificationsTables({ specifications, className }: SpecificationsProps){

  return (
    <>
      {specifications?.map((section, index) => (
        <div key={index} className={`space-y-2 ${className}`}>
          <h3 className="text-lg font-semibold">{section.title}</h3>

          <table className="w-full border-collapse rounded-md overflow-hidden bg-gray-200  border">
            <tbody>
              {section.attributes.map((attr, i) => (
                <tr
                  key={attr.id}
                  className={i % 2 === 0 ? "bg-gray-300" : "bg-white"}
                >
                  <td className="p-3 font-semibold w-[40%] text-gray-700">{attr.id}</td>
                  <td className="p-3 text-gray-700">{attr.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}
