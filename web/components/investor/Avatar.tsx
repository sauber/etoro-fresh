export default function Avatar(CustomerID: number) {
  //return <img class="max-w-none" src="/8991202.png" />;

  return (
    <div class="flex items-center">
      <img
        class="rounded-xl mr-4"
        src="/8991202.png"
        alt="Avatar of Writer"
      />
      <div class="text-sm">
        <p class="text-gray-900 leading-none">Rafael Martin</p>
        <p class="text-gray-600">Aug 9</p>
      </div>
    </div>
  );
}
