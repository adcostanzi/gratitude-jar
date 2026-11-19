import Image from "next/image";
import AddEntryDialog from "@/components/ui/add-entry-dialog";

export default function Home() {
  return (
    <>
      <main className="min-h-screen bg-white px-6 pb-32 pt-8 text-jar-charcoal md:py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h1 className="max-w-xl text-3xl font-semibold leading-tight sm:text-4xl md:mt-8">
            Every jar starts with one moment.
          </h1>
          <Image
            className="h-auto w-full max-w-[400px]"
            src="/images/gratitude-jar.svg"
            alt="Gratitude Jar"
            width={400}
            height={400}
          />
          <h2 className="mt-8 text-2xl font-semibold">Your Gratitude Jar</h2>
          <p className="mt-3 text-jar-gray">
            Begin colleting the little things that matter.
          </p>
          <AddEntryDialog content="Add your first Gratitude"/>
        </div>
      </main>
    </>
  );
}
